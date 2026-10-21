import { useEffect, useState } from 'react';
import api from '../api/client';
import { useLanguage } from '../context/LanguageContext';

export default function SourcesPage() {
  const { language } = useLanguage();
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get('/sources').then(({ data }) => setItems(data.data.items || []));
  }, []);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-3xl text-forest">Official sources</h1>
      <p className="mt-2 text-muted">Only published Election Commission of India properties. No invented URLs.</p>
      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <a key={item._id} href={item.url} target="_blank" rel="noreferrer" className="block rounded-2xl border border-line bg-card p-5 hover:shadow-soft">
            <h2 className="font-medium">{item.name}</h2>
            <p className="text-sm text-muted">{language === 'hi' && item.descriptionHi ? item.descriptionHi : item.description}</p>
            <p className="mt-2 text-xs text-muted">Last verified {new Date(item.lastVerified).toLocaleDateString('en-GB')}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
