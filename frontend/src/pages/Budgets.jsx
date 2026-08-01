import { useEffect, useState } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import AppLayout from '../components/AppLayout.jsx';
import Modal from '../components/Modal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import BudgetBar from '../components/BudgetBar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axios.js';

const inputClass =
  'w-full rounded-lg bg-ink border border-white/10 px-3 py-2.5 text-sm text-paper placeholder:text-slate-light focus:border-gold/60 focus:outline-none';
const labelClass = 'mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-light';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const Budgets = () => {
  const { user } = useAuth();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ category: '', amount: '' });
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [budgetsRes, catRes] = await Promise.all([
        api.get(`/budgets?month=${month}&year=${year}`),
        api.get('/categories?type=expense'),
      ]);
      setBudgets(budgetsRes.data.budgets);
      setCategories(catRes.data.categories);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year]);

  const changeMonth = (delta) => {
    let m = month + delta;
    let y = year;
    if (m > 12) {
      m = 1;
      y += 1;
    } else if (m < 1) {
      m = 12;
      y -= 1;
    }
    setMonth(m);
    setYear(y);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category || !form.amount) return toast.error('Fill in all fields');
    setSubmitting(true);
    try {
      await api.post('/budgets', { ...form, amount: Number(form.amount), month, year });
      toast.success('Budget saved');
      setFormOpen(false);
      setForm({ category: '', amount: '' });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save budget');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/budgets/${deleteTarget._id}`);
      toast.success('Budget removed');
      setDeleteTarget(null);
      load();
    } catch {
      toast.error('Failed to remove budget');
    }
  };

  const usedCategoryIds = new Set(budgets.map((b) => b.category._id));
  const availableCategories = categories.filter((c) => !usedCategoryIds.has(c._id));

  return (
    <AppLayout title="Budgets">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => changeMonth(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-light hover:bg-white/5"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="font-display text-lg text-paper w-40 text-center">
            {MONTH_NAMES[month - 1]} {year}
          </span>
          <button
            onClick={() => changeMonth(1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-light hover:bg-white/5"
          >
            <ChevronRight size={16} />
          </button>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-gold px-4 py-2.5 text-sm font-semibold text-ink hover:bg-gold-light transition-colors"
        >
          <Plus size={16} />
          Set Budget
        </button>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-gold border-t-transparent" />
        </div>
      ) : budgets.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 py-16 text-center">
          <p className="text-slate-light text-sm">No budgets set for this month yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((b) => (
            <BudgetBar key={b._id} budget={b} currency={user?.currency} onDelete={setDeleteTarget} />
          ))}
        </div>
      )}

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title="Set Monthly Budget">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Category</label>
            <select
              className={inputClass}
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            >
              <option value="">Select a category</option>
              {availableCategories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Monthly limit</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className={`${inputClass} font-mono`}
              placeholder="0.00"
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-light hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-gold px-5 py-2 text-sm font-semibold text-ink hover:bg-gold-light transition-colors disabled:opacity-60"
            >
              {submitting ? 'Saving...' : 'Save Budget'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Remove this budget?"
        message={`The budget for "${deleteTarget?.category?.name}" will be removed for this month.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AppLayout>
  );
};

export default Budgets;
