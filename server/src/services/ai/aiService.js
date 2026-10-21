const Groq = require('groq-sdk');
const env = require('../../config/env');
const AppError = require('../../utils/AppError');
const FAQ = require('../../models/FAQ');
const ElectoralInformation = require('../../models/ElectoralInformation');
const OfficialSource = require('../../models/OfficialSource');
const { INTENTS, detectHeuristicIntent } = require('./intentService');
const { buildContextWindow, inferFollowUpIntent } = require('./contextManager');
const { buildSystemPrompt, buildUserPrompt } = require('./promptService');
const { validateAssistantPayload, fallbackStructured } = require('./responseValidator');

const MODEL = 'qwen/qwen3.8-27b';
const HEURISTIC_THRESHOLD = 0.72;

function getClient() {
  if (!env.groqApiKey) {
    throw new AppError(
      'GROQ_API_KEY is not configured. Add it to server/.env to enable the assistant.',
      503,
      'AI_NOT_CONFIGURED'
    );
  }
  return new Groq({ apiKey: env.groqApiKey });
}

function extractJson(text) {
  if (!text) return null;
  const trimmed = text.trim();
  const fenced = trimmed.match(/```json([\s\S]*?)```/i);
  const raw = fenced ? fenced[1] : trimmed;
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(raw.slice(start, end + 1));
  } catch {
    return null;
  }
}

function detectLanguageHint(text, preferred) {
  const hindi = /[\u0900-\u097F]/.test(text);
  if (hindi) return 'hi';
  return preferred === 'hi' ? 'hi' : 'en';
}

async function retrieveKnowledge(intent, query) {
  const categoryMap = {
    VOTER_ELIGIBILITY: 'eligibility',
    VOTER_REGISTRATION: 'registration',
    DOCUMENT_REQUIREMENTS: 'documents',
    UPDATE_VOTER_DETAILS: 'update-details',
    ELECTORAL_PROCESS: 'electoral-process',
    OFFICIAL_SOURCE: 'official-resources',
  };

  const category = categoryMap[intent];
  const infoQuery = category
    ? ElectoralInformation.find({ published: true, category }).limit(3)
    : ElectoralInformation.find({
        published: true,
        $text: { $search: query || 'voter' },
      }).limit(3);

  const [info, faqs, sources] = await Promise.all([
    infoQuery.catch(() => ElectoralInformation.find({ published: true }).limit(3)),
    FAQ.find({ published: true }).limit(6),
    OfficialSource.find({ published: true }).limit(6),
  ]);

  return { info, faqs, sources };
}

function knowledgeToText({ info, faqs, sources }) {
  const blocks = [];
  info.forEach((item) => {
    blocks.push(`INFO: ${item.title}\n${item.summary}\n${item.content}\nSource: ${item.sourceName} ${item.sourceUrl}`);
  });
  faqs.slice(0, 4).forEach((item) => {
    blocks.push(`FAQ: ${item.question}\n${item.answer}`);
  });
  sources.forEach((item) => {
    blocks.push(`SOURCE: ${item.name} — ${item.url} — ${item.description}`);
  });
  return blocks.join('\n\n').slice(0, 8000);
}

function officialSourcesList(sources, info) {
  const mapped = [
    ...sources.map((item) => ({
      label: item.name,
      url: item.url,
      lastVerified: item.lastVerified,
      kind: 'official',
    })),
    ...info.map((item) => ({
      label: item.sourceName,
      url: item.sourceUrl,
      lastVerified: item.lastVerified,
      kind: 'stored',
    })),
  ];
  const seen = new Set();
  return mapped.filter((item) => {
    const key = item.url || item.label;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function classifyWithAi(message, heuristic) {
  const client = getClient();
  const completion = await client.chat.completions.create({
    model: MODEL,
    temperature: 0,
    max_tokens: 80,
    messages: [
      {
        role: 'system',
        content: `Classify the user message into one intent: ${INTENTS.join(', ')}. Return JSON {"intent":"","confidence":0-1}. No other text.`,
      },
      { role: 'user', content: message },
    ],
  });
  const parsed = extractJson(completion.choices[0]?.message?.content || '');
  if (!parsed || !INTENTS.includes(parsed.intent)) {
    return { ...heuristic, method: 'heuristic' };
  }
  return {
    intent: parsed.intent,
    confidence: Math.min(1, Number(parsed.confidence) || 0.6),
    method: 'ai',
  };
}

async function detectIntent(message, previousIntent) {
  const heuristic = detectHeuristicIntent(message);
  let result = heuristic;
  if (heuristic.confidence < HEURISTIC_THRESHOLD) {
    try {
      result = await classifyWithAi(message, heuristic);
    } catch (error) {
      if (error.errorCode === 'AI_NOT_CONFIGURED') throw error;
      result = heuristic;
    }
  }
  const intent = inferFollowUpIntent(result.intent, previousIntent);
  return { ...result, intent };
}

function structuredToMarkdown(structured) {
  const lines = [];
  if (structured.title) lines.push(`### ${structured.title}`, '');
  if (structured.summary) lines.push(structured.summary, '');
  (structured.sections || []).forEach((section) => {
    lines.push(`### ${section.heading}`);
    (section.bullets || []).forEach((bullet) => lines.push(`- ${bullet}`));
    lines.push('');
  });
  if (structured.steps?.length) {
    lines.push('### Next Steps');
    structured.steps.forEach((step, index) => lines.push(`${index + 1}. ${step}`));
    lines.push('');
  }
  return lines.join('\n').trim();
}

async function generateReply({ message, language, intent, history, knowledge }) {
  let structured;
  try {
    const client = getClient();
    const context = buildContextWindow(history);
    const completion = await client.chat.completions.create({
      model: MODEL,
      temperature: 0.2,
      max_tokens: 900,
      messages: [
        {
          role: 'system',
          content: buildSystemPrompt({
            language,
            knowledgeSnippets: knowledgeToText(knowledge),
          }),
        },
        ...context.map((item) => ({
          role: item.role === 'assistant' ? 'assistant' : 'user',
          content: item.content,
        })),
        {
          role: 'user',
          content: buildUserPrompt({ message, intent, language }),
        },
      ],
    });

    const parsed = extractJson(completion.choices[0]?.message?.content || '');
    const check = validateAssistantPayload(parsed);
    structured = check.ok ? parsed : fallbackStructured(language);
  } catch (error) {
    console.warn('Groq generation fallback triggered:', error.message);
    structured = fallbackStructured(language);
    // If we have retrieved database information, enhance the fallback with it
    if (knowledge.info && knowledge.info.length > 0) {
      const topInfo = knowledge.info[0];
      structured.title = language === 'hi' ? (topInfo.titleHi || topInfo.title) : topInfo.title;
      structured.summary = language === 'hi' ? (topInfo.summaryHi || topInfo.summary) : topInfo.summary;
      if (topInfo.steps && topInfo.steps.length > 0) {
        structured.steps = language === 'hi' ? (topInfo.stepsHi?.length ? topInfo.stepsHi : topInfo.steps) : topInfo.steps;
      }
    }
  }

  return {
    structured,
    content: structuredToMarkdown(structured),
  };
}

async function chat({ message, preferredLanguage, previousIntent, history }) {
  const language = detectLanguageHint(message, preferredLanguage);
  const intentResult = await detectIntent(message, previousIntent);
  const knowledge = await retrieveKnowledge(intentResult.intent, message);
  const { structured, content } = await generateReply({
    message,
    language,
    intent: intentResult.intent,
    history,
    knowledge,
  });

  const sources = officialSourcesList(knowledge.sources, knowledge.info);
  if (!sources.length) {
    sources.push({
      label: 'Election Commission of India',
      url: 'https://www.eci.gov.in/',
      lastVerified: new Date('2026-01-15'),
      kind: structured.sourceKind || 'official',
    });
  }

  return {
    language,
    intent: intentResult.intent,
    confidence: intentResult.confidence,
    method: intentResult.method,
    content,
    structured,
    sources,
  };
}

module.exports = { chat, detectIntent, INTENTS };
