import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Bookmark, FileText, HelpCircle, MessageSquare, ShieldCheck, UserCheck } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import Skeleton from '../components/ui/Skeleton';

const actions = [
  { to: '/app/chat', title: 'Ask a Question', icon: MessageSquare, text: 'Open the assistant' },
  { to: '/app/information/voter-registration', title: 'Voter Registration', icon: FileText, text: 'Step-by-step overview' },
  { to: '/app/information/voter-eligibility', title: 'Eligibility', icon: UserCheck, text: 'General criteria' },
  { to: '/app/information/update-voter-details', title: 'Update Details', icon: ShieldCheck, text: 'Corrections and changes' },
  { to: '/app/information/registration-documents', title: 'Documents', icon: FileText, text: 'What forms typically ask' },
  { to: '/app/faqs', title: 'Explore FAQs', icon: HelpCircle, text: 'Common questions' },
];

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/conversations'), api.get('/saved')])
      .then(([c, s]) => {
        setConversations(c.data.data.conversations || []);
        setSaved(s.data.data.items || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header>
        <h1 className="font-display text-3xl text-forest">
          {greeting()}, {user?.name?.split(' ')[0] || 'there'}.
        </h1>
        <p className="mt-1 text-muted">Ask clearly. Verify officially. Stay politically neutral.</p>
      </header>

      <section>
        <h2 className="text-sm uppercase tracking-[0.18em] text-muted">Quick actions</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {actions.map((action) => (
            <Link key={action.title} to={action.to} className="rounded-2xl border border-line bg-card p-4 transition hover:-translate-y-0.5 hover:shadow-soft">
              <action.icon size={18} className="text-forest" />
              <p className="mt-2 font-medium">{action.title}</p>
              <p className="text-sm text-muted">{action.text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Recent conversations</h2>
            <Link to="/app/chat" className="text-sm text-forest">New</Link>
          </div>
          <div className="mt-3 space-y-2">
            {loading && <Skeleton className="h-20" />}
            {!loading && !conversations.length && (
              <p className="rounded-2xl border border-dashed border-line p-6 text-sm text-muted">
                You don&apos;t have any conversations yet.
              </p>
            )}
            {conversations.slice(0, 5).map((item) => (
              <Link key={item._id} to={`/app/chat/${item._id}`} className="block rounded-2xl border border-line bg-card p-4">
                <p className="font-medium">{item.title}</p>
                <p className="line-clamp-2 text-sm text-muted">{item.preview || 'No messages yet'}</p>
                <p className="mt-1 text-xs text-muted">{new Date(item.updatedAt).toLocaleString()}</p>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Saved information</h2>
            <Link to="/app/saved" className="text-sm text-forest">View all</Link>
          </div>
          <div className="mt-3 space-y-2">
            {loading && <Skeleton className="h-20" />}
            {!loading && !saved.length && (
              <p className="rounded-2xl border border-dashed border-line p-6 text-sm text-muted">
                Save useful answers from the assistant to find them later.
              </p>
            )}
            {saved.slice(0, 5).map((item) => (
              <div key={item._id} className="rounded-2xl border border-line bg-card p-4">
                <p className="flex items-center gap-2 font-medium">
                  <Bookmark size={14} /> {item.title}
                </p>
                <p className="text-sm text-muted">{item.snippet}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-card p-5">
        <h2 className="font-medium">Usage overview</h2>
        <p className="mt-1 text-sm text-muted">Counts from your account — not decorative metrics.</p>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="font-display text-3xl text-forest">{conversations.reduce((n, c) => n + (c.messageCount || 0), 0)}</p>
            <p className="text-xs text-muted">Messages</p>
          </div>
          <div>
            <p className="font-display text-3xl text-forest">{conversations.length}</p>
            <p className="text-xs text-muted">Conversations</p>
          </div>
          <div>
            <p className="font-display text-3xl text-forest">{saved.length}</p>
            <p className="text-xs text-muted">Saved resources</p>
          </div>
        </div>
      </section>
    </div>
  );
}
