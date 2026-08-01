import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

const inputClass =
  'w-full rounded-lg bg-ink border border-white/10 px-3 py-2.5 text-sm text-paper placeholder:text-slate-light focus:border-gold/60 focus:outline-none transition-colors';
const labelClass = 'mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-light';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD'];

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    currency: 'USD',
    monthlyIncome: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      await register({ ...form, monthlyIncome: Number(form.monthlyIncome) || 0 });
      toast.success('Account created — welcome to your ledger');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 text-gold mb-4">
            <BookOpen size={22} />
          </div>
          <h1 className="font-display text-2xl text-paper">Open your ledger</h1>
          <p className="mt-1 text-sm text-slate-light">Start tracking every rupee, dollar, or euro</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-ink-light border border-white/5 p-6">
          <div>
            <label className={labelClass}>Full name</label>
            <input
              required
              className={inputClass}
              placeholder="Jordan Blake"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelClass}>Email</label>
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
            <label className={labelClass}>Password</label>
            <input
              type="password"
              required
              minLength={8}
              className={inputClass}
              placeholder="At least 8 characters"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Currency</label>
              <select
                className={inputClass}
                value={form.currency}
                onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Monthly income</label>
              <input
                type="number"
                min="0"
                className={`${inputClass} font-mono`}
                placeholder="0.00"
                value={form.monthlyIncome}
                onChange={(e) => setForm((f) => ({ ...f, monthlyIncome: e.target.value }))}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gold py-2.5 text-sm font-semibold text-ink hover:bg-gold-light transition-colors disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-light">
          Already have an account?{' '}
          <Link to="/login" className="text-gold hover:text-gold-light font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
