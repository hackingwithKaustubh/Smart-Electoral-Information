import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Copy,
  Mic,
  MoreHorizontal,
  PanelRight,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Send,
  Trash2,
  Volume2,
  X,
} from 'lucide-react';
import api from '../api/client';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import useSpeech from '../hooks/useSpeech';

const SUGGESTIONS = [
  'How can I register as a voter?',
  'What documents are generally required for registration?',
  'How can I update my voter information?',
  'How can I check whether I am eligible?',
  'Where can I find official electoral information?',
];

function StructuredMessage({ structured, content }) {
  if (!structured) {
    return <p className="whitespace-pre-wrap text-sm leading-6">{content}</p>;
  }
  return (
    <div className="space-y-3 text-sm leading-6">
      {structured.title && <h3 className="font-display text-lg">{structured.title}</h3>}
      {structured.summary && <p>{structured.summary}</p>}
      {(structured.sections || []).map((section) => (
        <div key={section.heading}>
          <p className="font-medium">{section.heading}</p>
          <ul className="mt-1 list-disc pl-5">
            {(section.bullets || []).map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </div>
      ))}
      {structured.steps?.length ? (
        <div>
          <p className="font-medium">Next Steps</p>
          <ol className="mt-1 list-decimal pl-5">
            {structured.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      ) : null}
    </div>
  );
}

export default function ChatPage() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const { push } = useToast();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [active, setActive] = useState(null);
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');
  const [loadingList, setLoadingList] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [sourcesOpen, setSourcesOpen] = useState(true);
  const [menuId, setMenuId] = useState(null);
  const [lastUser, setLastUser] = useState('');
  const bottomRef = useRef(null);

  const onVoice = useCallback((text) => setInput(text), []);
  const speech = useSpeech({ onResult: onVoice });

  async function loadList(search = '') {
    const { data } = await api.get('/conversations', { params: search ? { q: search } : {} });
    setConversations(data.data.conversations || []);
    setLoadingList(false);
  }

  async function loadOne(id) {
    const { data } = await api.get(`/conversations/${id}`);
    setActive(data.data.conversation);
    setMessages(data.data.messages || []);
  }

  useEffect(() => {
    loadList().catch(() => setLoadingList(false));
  }, []);

  useEffect(() => {
    if (conversationId) loadOne(conversationId).catch(() => push('Conversation not found.', 'error'));
    else {
      setActive(null);
      setMessages([]);
    }
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  const lastAssistant = useMemo(
    () => [...messages].reverse().find((item) => item.role === 'assistant'),
    [messages]
  );

  async function send(text) {
    speech.cancelSpeech();
    const message = (text || input).trim();
    if (!message || sending) return;
    setSending(true);
    setError('');
    setLastUser(message);
    setInput('');
    try {
      const { data } = await api.post('/ai/chat', {
        message,
        conversationId: active?._id || conversationId,
      });
      const convo = data.data.conversation;
      setActive(convo);
      setMessages((current) => {
        if (!conversationId) return [data.data.userMessage, data.data.assistantMessage];
        return [...current, data.data.userMessage, data.data.assistantMessage];
      });
      await loadList(query);
      if (!conversationId) navigate(`/app/chat/${convo._id}`, { replace: true });
    } catch (err) {
      setError(err.message || 'Something went wrong while generating the response. Please try again.');
    } finally {
      setSending(false);
    }
  }

  async function rename(id) {
    const title = window.prompt('Rename conversation');
    if (!title) return;
    await api.put(`/conversations/${id}`, { title });
    await loadList(query);
  }

  async function remove(id) {
    await api.delete(`/conversations/${id}`);
    await loadList(query);
    if (id === (active?._id || conversationId)) navigate('/app/chat');
  }

  async function saveMessage(message) {
    await api.post('/saved', {
      type: 'message',
      refId: message._id,
      title: message.structured?.title || 'Saved answer',
      snippet: (message.content || '').slice(0, 220),
      payload: message,
    });
    push('Saved to your library.');
  }

  return (
    <div className="-mx-4 -my-6 grid min-h-[calc(100vh-7.5rem)] overflow-hidden border-t border-line bg-paper md:-mx-8 md:grid-cols-[260px_1fr] xl:grid-cols-[260px_1fr_300px]">
      <aside className="hidden border-r border-line bg-card md:flex md:flex-col">
        <div className="p-3">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-forest py-2 text-sm text-white"
            onClick={() => navigate('/app/chat')}
          >
            <Plus size={16} /> New conversation
          </button>
          <label className="mt-3 flex items-center gap-2 rounded-xl border border-line px-2 py-1.5 text-sm">
            <Search size={14} />
            <input
              className="w-full bg-transparent outline-none"
              placeholder="Search conversations"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                loadList(e.target.value);
              }}
            />
          </label>
        </div>
        <div className="flex-1 overflow-y-auto px-2 pb-3">
          {loadingList && <p className="px-2 text-xs text-muted">Loading…</p>}
          {!loadingList && !conversations.length && (
            <p className="px-2 text-sm text-muted">You don&apos;t have any conversations yet.</p>
          )}
          {conversations.map((item) => (
            <div key={item._id} className="relative">
              <Link
                to={`/app/chat/${item._id}`}
                className={`block rounded-xl px-3 py-2 ${
                  (active?._id || conversationId) === item._id ? 'bg-paper' : 'hover:bg-paper'
                }`}
              >
                <p className="truncate text-sm font-medium">{item.title}</p>
                <p className="truncate text-xs text-muted">{item.preview || 'Empty'}</p>
              </Link>
              <button
                type="button"
                className="absolute right-2 top-2 text-muted"
                onClick={() => setMenuId(menuId === item._id ? null : item._id)}
                aria-label="Conversation actions"
              >
                <MoreHorizontal size={14} />
              </button>
              {menuId === item._id && (
                <div className="absolute right-2 top-8 z-10 rounded-xl border border-line bg-card p-1 text-sm shadow-soft">
                  <button className="flex w-full items-center gap-2 px-3 py-1" onClick={() => rename(item._id)}>
                    <Pencil size={12} /> Rename
                  </button>
                  <button className="flex w-full items-center gap-2 px-3 py-1" onClick={() => remove(item._id)}>
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>

      <section className="flex min-w-0 flex-col bg-paper">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <div>
            <p className="font-medium">{active?.title || 'New conversation'}</p>
            <p className="text-xs text-muted">Hybrid intent · Llama 3.3 70B via Groq</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              className="rounded-full border border-line bg-card px-2 py-1 text-xs"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
            </select>
            <button type="button" className="xl:hidden" onClick={() => setSourcesOpen(!sourcesOpen)} aria-label="Sources">
              <PanelRight size={18} />
            </button>
          </div>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 md:px-8">
          {!messages.length && !sending && (
            <div>
              <h1 className="font-display text-3xl text-forest">Ask about electoral processes</h1>
              <p className="mt-2 max-w-xl text-muted">
                Civora will not recommend a candidate or party. It explains published processes and points you to
                official sources.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {SUGGESTIONS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="rounded-full border border-line bg-card px-3 py-2 text-left text-sm hover:border-forest/30"
                    onClick={() => send(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((message) => (
            <article key={message._id} className={`max-w-3xl ${message.role === 'user' ? 'ml-auto' : ''}`}>
              <div
                className={`rounded-2xl px-4 py-3 ${
                  message.role === 'user' ? 'bg-forest text-white' : 'border border-line bg-card'
                }`}
              >
                {message.role === 'assistant' ? (
                  <StructuredMessage structured={message.structured} content={message.content} />
                ) : (
                  <p className="text-sm">{message.content}</p>
                )}
              </div>
              <div className="mt-1 flex items-center gap-3 text-[11px] text-muted">
                <span>{new Date(message.createdAt).toLocaleTimeString()}</span>
                {message.role === 'assistant' && (
                  <>
                    <button type="button" onClick={() => navigator.clipboard.writeText(message.content)}>
                      <Copy size={12} className="inline" /> Copy
                    </button>
                    <button type="button" onClick={() => saveMessage(message)}>
                      ♡ Save
                    </button>
                    <button type="button" onClick={() => speech.speak(message.content, message.language)}>
                      <Volume2 size={12} className="inline" /> Listen
                    </button>
                  </>
                )}
              </div>
            </article>
          ))}
          {sending && (
            <div className="flex items-center gap-1 text-sm text-muted" aria-live="polite">
              <span className="h-2 w-2 rounded-full bg-forest" style={{ animation: 'pulse-dot 1s infinite' }} />
              <span className="h-2 w-2 rounded-full bg-forest" style={{ animation: 'pulse-dot 1s 0.15s infinite' }} />
              <span className="h-2 w-2 rounded-full bg-forest" style={{ animation: 'pulse-dot 1s 0.3s infinite' }} />
              <span className="ml-2">Understanding your question…</span>
            </div>
          )}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-900">
              {error}
              <button type="button" className="ml-3 underline" onClick={() => send(lastUser)}>
                Try again
              </button>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        <form
          className="border-t border-line p-3 md:p-4"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          {speech.error && <p className="mb-2 text-xs text-danger">{speech.error}</p>}
          <div className="flex items-end gap-2 rounded-2xl border border-line bg-card p-2">
            <button
              type="button"
              className={`rounded-xl p-2 ${speech.listening ? 'bg-forest text-white' : 'text-muted'}`}
              onClick={() => (speech.listening ? speech.stop() : speech.start(language))}
              aria-label="Voice input"
            >
              <Mic size={18} />
            </button>
            <textarea
              rows={1}
              className="max-h-32 min-h-[44px] flex-1 resize-none bg-transparent py-2 text-sm outline-none"
              placeholder="Ask about registration, eligibility, documents…"
              value={input}
              onChange={(e) => {
                speech.cancelSpeech();
                setInput(e.target.value);
              }}
              onFocus={() => speech.cancelSpeech()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
            />
            {lastUser && (
              <button type="button" className="p-2 text-muted" onClick={() => send(lastUser)} aria-label="Regenerate">
                <RefreshCw size={16} />
              </button>
            )}
            <button type="submit" className="rounded-xl bg-forest p-2 text-white" disabled={sending} aria-label="Send">
              <Send size={16} />
            </button>
          </div>
        </form>
      </section>

      <aside className={`${sourcesOpen ? 'flex' : 'hidden'} flex-col border-l border-line bg-card xl:flex`}>
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <p className="text-sm font-medium">Information / Sources</p>
          <button type="button" className="xl:hidden" onClick={() => setSourcesOpen(false)} aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 text-sm">
          {!lastAssistant && <p className="text-muted">Sources will appear after the assistant replies.</p>}
          {lastAssistant?.sources?.map((source) => (
            <article key={`${source.url}-${source.label}`} className="mb-4 rounded-xl border border-line p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-gold">Information source</p>
              <p className="mt-1 font-medium">{source.label}</p>
              <p className="text-xs text-muted">Kind: {source.kind?.replace('_', ' ')}</p>
              {source.lastVerified && (
                <p className="text-xs text-muted">
                  Last verified: {new Date(source.lastVerified).toLocaleDateString('en-GB')}
                </p>
              )}
              {source.url && (
                <a className="mt-2 inline-block text-forest" href={source.url} target="_blank" rel="noreferrer">
                  View official source →
                </a>
              )}
            </article>
          ))}
          {lastAssistant?.structured?.followUps?.length ? (
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.16em] text-muted">Continue</p>
              {lastAssistant.structured.followUps.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="mb-2 block w-full rounded-xl border border-line px-3 py-2 text-left"
                  onClick={() => send(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
