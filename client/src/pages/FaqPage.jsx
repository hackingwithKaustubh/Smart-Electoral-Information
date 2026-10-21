import { useEffect, useState } from 'react';
import api from '../api/client';
import { useLanguage } from '../context/LanguageContext';

export default function FaqPage() {
  const { language } = useLanguage();
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    api.get('/faqs').then(({ data }) => setItems(data.data.items || []));
  }, []);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-3xl text-forest">Frequently asked questions</h1>
      <div className="mt-6 divide-y divide-line rounded-2xl border border-line bg-card">
        {items.map((item, index) => (
          <button key={item._id} type="button" className="w-full px-5 py-4 text-left" onClick={() => setOpen(open === index ? null : index)}>
            <p className="font-medium">{language === 'hi' && item.questionHi ? item.questionHi : item.question}</p>
            {open === index && (
              <p className="mt-2 text-sm text-muted">{language === 'hi' && item.answerHi ? item.answerHi : item.answer}</p>
            )}
          </button>
        ))}
        {!items.length && <p className="p-5 text-sm text-muted">No FAQs loaded yet. Seed the database after starting MongoDB.</p>}
      </div>
    </div>
  );
}
