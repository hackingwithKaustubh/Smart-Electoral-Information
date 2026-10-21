import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Shield,
  Languages,
  Mic,
  History,
  Sparkles,
  BookOpen,
  ScanSearch,
  Landmark,
} from 'lucide-react';
import api from '../api/client';
import { useLanguage } from '../context/LanguageContext';

const FEATURES = [
  { icon: Sparkles, title: 'AI Assistant', text: 'Plain-language answers to electoral process questions.' },
  { icon: BookOpen, title: 'Electoral Information', text: 'Eligibility, registration, documents and updates in one hub.' },
  { icon: ScanSearch, title: 'Smart Intent Detection', text: 'Heuristic plus LLM classification for predictable and open questions.' },
  { icon: Languages, title: 'Multilingual Support', text: 'English and Hindi, with a path to add more languages.' },
  { icon: Mic, title: 'Voice Interaction', text: 'Speak a question using the browser speech APIs when available.' },
  { icon: Shield, title: 'Secure Authentication', text: 'JWT sessions, hashed passwords and role-based API access.' },
  { icon: History, title: 'Conversation History', text: 'Continue, rename, search and save useful explanations.' },
  { icon: Landmark, title: 'Official Sources', text: 'Responses point to ECI properties — never invented URLs.' },
];

export default function LandingPage() {
  const { language } = useLanguage();
  const [openFaq, setOpenFaq] = useState(0);
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    api
      .get('/faqs')
      .then(({ data }) => setFaqs(data.data.items || []))
      .catch(() => setFaqs([]));
  }, []);

  return (
    <div>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-2 md:py-24">
        <div className="animate-rise">
          <p className="text-xs uppercase tracking-[0.28em] text-gold">Neutral · Informational · Secure</p>
          <h1 className="mt-4 font-display text-4xl leading-[1.15] text-forest md:text-5xl">
            Your Intelligent Guide to Electoral Information
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted">
            Understand electoral processes, eligibility, registration and voter services through a secure
            conversational information assistant.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register" className="rounded-full bg-forest px-6 py-3 text-white shadow-soft">
              Start Conversation
            </Link>
            <Link to="/information" className="rounded-full border border-forest/20 px-6 py-3 text-forest">
              Explore Information
            </Link>
          </div>
        </div>
        <div className="animate-rise rounded-3xl border border-line bg-card p-5 shadow-soft">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Assistant preview</p>
          <div className="mt-4 space-y-3">
            <div className="ml-8 rounded-2xl rounded-tr-sm bg-paper px-4 py-3 text-sm">
              How can I register as a voter?
            </div>
            <div className="mr-4 rounded-2xl rounded-tl-sm bg-forest px-4 py-3 text-sm text-white">
              Here is a step-by-step overview. Use the Voters’ Service Portal published by the Election Commission of
              India, complete the current new-registration form, upload the documents listed on that form, and track
              your application with the official reference number.
            </div>
            <div className="rounded-xl border border-gold/30 bg-gold-2/15 px-4 py-3 text-xs text-forest">
              Information source · Election Commission of India · Last verified 15/01/2026
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="border-y border-line bg-card/60 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-display text-3xl text-forest">How it works</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {[
              ['Ask', 'Type or speak a question in English or Hindi.'],
              ['Understand', 'Heuristics and the model classify intent with context.'],
              ['Assist', 'You receive structured steps, not a wall of text.'],
              ['Verify', 'Every heavy answer cites official or stored sources.'],
            ].map(([title, text], index) => (
              <article key={title} className="rounded-2xl border border-line bg-paper p-5">
                <p className="text-xs text-gold">0{index + 1}</p>
                <h3 className="mt-2 font-display text-xl">{title}</h3>
                <p className="mt-2 text-sm text-muted">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-display text-3xl text-forest">Core features</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <article key={feature.title} className="rounded-2xl border border-line bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-soft">
              <feature.icon className="text-forest" size={20} />
              <h3 className="mt-3 font-medium">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted">{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-8 md:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl text-forest">Why use the platform?</h2>
          <ul className="mt-5 space-y-3 text-muted">
            <li>Simplified information instead of scattered PDFs and rumours.</li>
            <li>Centralized access to FAQs, processes and official links.</li>
            <li>Conversational interaction that remembers follow-up questions.</li>
            <li>An accessible interface with keyboard-friendly controls.</li>
            <li>A secure user experience with hashed passwords and protected APIs.</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-line bg-card p-6">
          <h3 className="font-display text-2xl">AI assistant preview</h3>
          <p className="mt-3 text-sm text-muted">
            “What documents do I need?” after a registration question stays in that context. Responses use headings,
            requirements and next steps — then a source panel.
          </p>
        </div>
      </section>

      <section id="security" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-display text-3xl text-forest">Security</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {[
            ['JWT authentication', 'Short-lived session tokens in httpOnly cookies and bearer headers.'],
            ['bcrypt hashing', 'Passwords are never stored in plain text.'],
            ['Protected APIs', 'Conversation, save and profile routes require a valid user.'],
            ['Role-based access', 'Admin tools are blocked for ordinary accounts.'],
          ].map(([title, text]) => (
            <article key={title} className="rounded-2xl border border-line bg-card p-5">
              <h3 className="font-medium">{title}</h3>
              <p className="mt-2 text-sm text-muted">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-20">
        <h2 className="font-display text-3xl text-forest">FAQ</h2>
        <div className="mt-6 divide-y divide-line rounded-2xl border border-line bg-card">
          {(faqs.length ? faqs.slice(0, 6) : []).map((item, index) => (
            <button
              key={item._id || index}
              type="button"
              className="w-full px-5 py-4 text-left"
              onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
            >
              <p className="font-medium">{language === 'hi' && item.questionHi ? item.questionHi : item.question}</p>
              {openFaq === index && (
                <p className="mt-2 text-sm text-muted">
                  {language === 'hi' && item.answerHi ? item.answerHi : item.answer}
                </p>
              )}
            </button>
          ))}
          {!faqs.length && (
            <p className="px-5 py-6 text-sm text-muted">
              Start the API and seed the database to load live FAQs. Until then, common questions cover registration,
              documents, eligibility and official sources.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
