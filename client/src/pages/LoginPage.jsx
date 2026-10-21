import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function LoginPage() {
  const { login } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      await login(form);
      push('Welcome back.');
      navigate('/app');
    } catch (error) {
      push(error.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-3xl text-forest">Log in</h1>
      <p className="mt-2 text-sm text-muted">Your session is stored securely. Passwords are never sent in logs.</p>
      <form className="mt-8 space-y-4" onSubmit={onSubmit}>
        <label className="block text-sm">
          Email
          <input className="mt-1 w-full rounded-xl border border-line bg-card px-3 py-2" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" />
        </label>
        <label className="block text-sm">
          Password
          <span className="relative mt-1 block">
            <input
              type={show ? 'text' : 'password'}
              className="w-full rounded-xl border border-line bg-card px-3 py-2 pr-10"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              autoComplete="current-password"
            />
            <button type="button" className="absolute right-3 top-2.5" onClick={() => setShow(!show)} aria-label="Toggle password">
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </span>
        </label>
        <button disabled={loading} className="w-full rounded-full bg-forest py-3 text-white disabled:opacity-60">
          {loading ? 'Signing in…' : 'Log in'}
        </button>
      </form>
      <p className="mt-4 text-sm text-muted">
        New here? <Link to="/register" className="text-forest">Create an account</Link>
      </p>
    </div>
  );
}
