const INTENTS = [
  'GREETING',
  'VOTER_ELIGIBILITY',
  'VOTER_REGISTRATION',
  'DOCUMENT_REQUIREMENTS',
  'UPDATE_VOTER_DETAILS',
  'ELECTORAL_PROCESS',
  'GENERAL_INFORMATION',
  'FAQ',
  'OFFICIAL_SOURCE',
  'LANGUAGE_REQUEST',
  'UNKNOWN',
];

const RULES = [
  {
    intent: 'GREETING',
    patterns: [/^\s*(hi|hello|hey|namaste|नमस्ते|good (morning|afternoon|evening))\b/i],
    weight: 0.95,
  },
  {
    intent: 'LANGUAGE_REQUEST',
    patterns: [/in hindi/i, /हिंदी में/i, /switch (to )?hindi/i, /respond in/i],
    weight: 0.9,
  },
  {
    intent: 'VOTER_REGISTRATION',
    patterns: [
      /regist(er|ration|ering)/i,
      /enroll/i,
      /new voter/i,
      /form 6\b/i,
      /पंजीकरण/i,
      /नया मतदाता/i,
    ],
    weight: 0.88,
  },
  {
    intent: 'DOCUMENT_REQUIREMENTS',
    patterns: [/document/i, /proof/i, /what do i need/i, /papers/i, /दस्तावेज/i, /प्रमाण/i],
    weight: 0.86,
  },
  {
    intent: 'UPDATE_VOTER_DETAILS',
    patterns: [/update/i, /correction/i, /change (my )?(address|name|photo|details)/i, /form 8\b/i, /सुधार/i, /अपडेट/i],
    weight: 0.86,
  },
  {
    intent: 'VOTER_ELIGIBILITY',
    patterns: [/eligib/i, /who can vote/i, /age/i, /18 years/i, /पात्र/i, /कौन वोट/i],
    weight: 0.86,
  },
  {
    intent: 'OFFICIAL_SOURCE',
    patterns: [/official (site|source|website|portal)/i, /eci/i, /nvsp/i, /helpline/i, /आधिकारिक/i],
    weight: 0.84,
  },
  {
    intent: 'ELECTORAL_PROCESS',
    patterns: [/how (do|does|to) vot/i, /voting process/i, /evm/i, /vvpat/i, /polling/i, /booth/i, /मतदान/i],
    weight: 0.88,
  },
  {
    intent: 'FAQ',
    patterns: [/faq/i, /frequently/i, /common question/i],
    weight: 0.75,
  },
];

function detectHeuristicIntent(text = '') {
  const input = String(text).trim();
  if (!input) {
    return { intent: 'UNKNOWN', confidence: 0, method: 'heuristic' };
  }

  let best = { intent: 'UNKNOWN', confidence: 0.15, method: 'heuristic' };
  for (const rule of RULES) {
    if (rule.patterns.some((pattern) => pattern.test(input))) {
      if (rule.weight > best.confidence) {
        best = { intent: rule.intent, confidence: rule.weight, method: 'heuristic' };
      }
    }
  }
  return best;
}

module.exports = { INTENTS, detectHeuristicIntent };
