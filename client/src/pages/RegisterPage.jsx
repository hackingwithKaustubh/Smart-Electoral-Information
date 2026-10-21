import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

function strength(password) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

export default function RegisterPage() {
  const { register } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    preferredLanguage: 'en',
  });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const score = strength(form.password);
  const labels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];

  function validate() {
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Enter your full name.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email.';
    if (form.password.length < 8) next.password = 'Use at least 8 characters.';
    else if (!/[A-Z]/.test(form.password) || !/[0-9]/.test(form.password)) {
      next.password = 'Include an uppercase letter and a number.';
    }
    if (form.password !== form.confirmPassword) next.confirmPassword = 'Passwords do not match.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(event) {
    event.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form);
      push('Account created. Welcome to Civora.');
      navigate('/app');
    } catch (error) {
      push(error.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  const field = (name) => (event) => setForm((current) => ({ ...current, [name]: event.target.value }));

  const scoreColor = useMemo(() => ['bg-red-300', 'bg-red-400', 'bg-amber-400', 'bg-lime-500', 'bg-forest'][score], [score]);

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-3xl text-forest">Create your account</h1>
      <p className="mt-2 text-sm text-muted">Registration stores only what you need to personalise language and history.</p>
      <form className="mt-8 space-y-4" onSubmit={onSubmit} noValidate>
        <label className="block text-sm">
          Full name
          <input className="mt-1 w-full rounded-xl border border-line bg-card px-3 py-2" value={form.name} onChange={field('name')} autoComplete="name" />
          {errors.name && <span className="text-xs text-danger">{errors.name}</span>}
        </label>
        <label className="block text-sm">
          Email
          <input className="mt-1 w-full rounded-xl border border-line bg-card px-3 py-2" value={form.email} onChange={field('email')} autoComplete="email" />
          {errors.email && <span className="text-xs text-danger">{errors.email}</span>}
        </label>
        <label className="block text-sm">
          Password
          <span className="relative mt-1 block">
            <input
              type={show ? 'text' : 'password'}
              className="w-full rounded-xl border border-line bg-card px-3 py-2 pr-10"
              value={form.password}
              onChange={field('password')}
              autoComplete="new-password"
            />
            <button type="button" className="absolute right-3 top-2.5 text-muted" onClick={() => setShow(!show)} aria-label="Toggle password">
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </span>
          <span className="mt-2 flex gap-1" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={`h-1.5 flex-1 rounded-full ${score > i ? scoreColor : 'bg-line'}`} />
            ))}
          </span>
          <span className="text-xs text-muted">{form.password ? labels[score] : 'Use 8+ characters, uppercase and a number.'}</span>
          {errors.password && <span className="block text-xs text-danger">{errors.password}</span>}
        </label>
        <label className="block text-sm">
          Confirm password
          <input type="password" className="mt-1 w-full rounded-xl border border-line bg-card px-3 py-2" value={form.confirmPassword} onChange={field('confirmPassword')} autoComplete="new-password" />
          {errors.confirmPassword && <span className="text-xs text-danger">{errors.confirmPassword}</span>}
        </label>
        <label className="block text-sm">
          Preferred language
          <select className="mt-1 w-full rounded-xl border border-line bg-card px-3 py-2" value={form.preferredLanguage} onChange={field('preferredLanguage')}>
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
          </select>
        </label>
        <button disabled={loading} className="w-full rounded-full bg-forest py-3 text-white disabled:opacity-60">
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      <p className="mt-4 text-sm text-muted">
        Already registered? <Link to="/login" className="text-forest">Log in</Link>
      </p>
    </div>
  );
}
