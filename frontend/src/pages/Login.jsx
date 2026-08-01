import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

const inputClass =
  'w-full rounded-lg bg-ink border border-white/10 px-3 py-2.5 text-sm text-paper placeholder:text-slate-light focus:border-gold/60 focus:outline-none transition-colors';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 text-gold mb-4">
            <BookOpen size={22} />
          </div>
          <h1 className="font-display text-2xl text-paper">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-light">Sign in to keep your ledger current</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-ink-light border border-white/5 p-6">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-light">
              Email
            </label>
            <input
              type="email"
              required
              className={inputClass}
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-light">
              Password
            </label>
            <input
              type="password"
              required
              className={inputClass}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gold py-2.5 text-sm font-semibold text-ink hover:bg-gold-light transition-colors disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-light">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-gold hover:text-gold-light font-medium">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
