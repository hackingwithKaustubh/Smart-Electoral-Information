import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/client';
import { useLanguage } from '../context/LanguageContext';
import Skeleton from '../components/ui/Skeleton';

const CATEGORIES = [
  { id: '', label: 'All' },
  { id: 'eligibility', label: 'Eligibility' },
  { id: 'registration', label: 'Registration' },
  { id: 'documents', label: 'Documents' },
  { id: 'update-details', label: 'Updating Details' },
  { id: 'electoral-process', label: 'Electoral process' },
  { id: 'official-resources', label: 'Official resources' },
];

export default function InformationHubPage({ embedded = false }) {
  const { language } = useLanguage();
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get('/information', { params: category ? { category } : {} })
      .then(({ data }) => setItems(data.data.items || []))
      .finally(() => setLoading(false));
  }, [category]);

  const prefix = embedded ? '/app/information' : '/information';

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-display text-3xl text-forest">Electoral information hub</h1>
      <p className="mt-2 text-muted">Curated, source-labelled overviews. Confirm live instructions on official portals.</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {CATEGORIES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setCategory(item.id)}
            className={`rounded-full px-3 py-1.5 text-sm ${category === item.id ? 'bg-forest text-white' : 'border border-line bg-card'}`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {loading && <Skeleton className="h-36 md:col-span-2" />}
        {items.map((item) => (
          <Link key={item._id} to={`${prefix}/${item.slug}`} className="rounded-2xl border border-line bg-card p-5 hover:shadow-soft">
            <p className="text-xs uppercase tracking-[0.16em] text-gold">{item.category}</p>
            <h2 className="mt-1 font-display text-xl">
              {language === 'hi' && item.titleHi ? item.titleHi : item.title}
            </h2>
            <p className="mt-2 text-sm text-muted">
              {language === 'hi' && item.summaryHi ? item.summaryHi : item.summary}
            </p>
          </Link>
        ))}
        {!loading && !items.length && <p className="text-sm text-muted">No information matched your filter.</p>}
      </div>
    </div>
  );
}
