import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/client';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import Skeleton from '../components/ui/Skeleton';

export default function InformationDetailPage() {
  const { id } = useParams();
  const { language } = useLanguage();
  const { user } = useAuth();
  const { push } = useToast();
  const [item, setItem] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/information/${id}`)
      .then(({ data }) => setItem(data.data.item))
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <p className="text-danger">{error}</p>;
  if (!item) return <Skeleton className="h-64" />;

  const title = language === 'hi' && item.titleHi ? item.titleHi : item.title;
  const summary = language === 'hi' && item.summaryHi ? item.summaryHi : item.summary;
  const content = language === 'hi' && item.contentHi ? item.contentHi : item.content;
  const steps = language === 'hi' && item.stepsHi?.length ? item.stepsHi : item.steps;

  async function save() {
    if (!user) return;
    await api.post('/saved', {
      type: 'information',
      refId: item._id,
      title: item.title,
      snippet: item.summary,
      payload: { slug: item.slug },
    });
    push('Saved.');
  }

  return (
    <article className="mx-auto max-w-3xl">
      <p className="text-xs uppercase tracking-[0.16em] text-gold">{item.category}</p>
      <h1 className="mt-2 font-display text-4xl text-forest">{title}</h1>
      <p className="mt-4 text-lg text-muted">{summary}</p>
      <p className="mt-6 leading-7">{content}</p>
      {steps?.length ? (
        <ol className="mt-6 list-decimal space-y-2 pl-5">
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      ) : null}
      <aside className="mt-8 rounded-2xl border border-gold/30 bg-card p-4">
        <p className="text-xs uppercase tracking-[0.16em] text-gold">Information source</p>
        <p className="mt-1 font-medium">{item.sourceName}</p>
        <p className="text-sm text-muted">Last verified: {new Date(item.lastVerified).toLocaleDateString('en-GB')}</p>
        <a className="mt-2 inline-block text-forest" href={item.sourceUrl} target="_blank" rel="noreferrer">
          View official source →
        </a>
      </aside>
      <div className="mt-6 flex gap-3">
        {user && (
          <button type="button" onClick={save} className="rounded-full border border-line px-4 py-2 text-sm">
            Save information
          </button>
        )}
        <Link to={user ? '/app/information' : '/information'} className="text-sm text-forest">
          Back to hub
        </Link>
      </div>
    </article>
  );
}
