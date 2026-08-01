import { useEffect, useState } from 'react';
import { Plus, Trash2, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import AppLayout from '../components/AppLayout.jsx';
import Modal from '../components/Modal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import api from '../api/axios.js';

const EMOJI_OPTIONS = ['🍔', '🚗', '🏠', '💡', '🎬', '💊', '🛍️', '📚', '✈️', '🐾', '🎁', '📦', '💰', '💻', '➕'];
const COLOR_OPTIONS = ['#1F6F5C', '#C9973E', '#B24C3A', '#3B6FA0', '#8B5E83', '#4A8B7C', '#5C8A3A', '#6B7280'];

const inputClass =
  'w-full rounded-lg bg-ink border border-white/10 px-3 py-2.5 text-sm text-paper placeholder:text-slate-light focus:border-gold/60 focus:outline-none';
const labelClass = 'mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-light';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ name: '', icon: '📦', color: '#1F6F5C', type: 'expense' });
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/categories');
      setCategories(data.categories);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Category name is required');
    setSubmitting(true);
    try {
      await api.post('/categories', form);
      toast.success('Category created');
      setFormOpen(false);
      setForm({ name: '', icon: '📦', color: '#1F6F5C', type: 'expense' });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/categories/${deleteTarget._id}`);
      toast.success('Category deleted');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete category');
      setDeleteTarget(null);
    }
  };

  const expenseCats = categories.filter((c) => c.type === 'expense');
  const incomeCats = categories.filter((c) => c.type === 'income');

  const renderGrid = (list) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {list.map((c) => (
        <div
          key={c._id}
          className="flex items-center gap-3 rounded-xl bg-ink-light border border-white/5 p-3.5"
        >
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base"
            style={{ backgroundColor: `${c.color}20` }}
          >
            {c.icon}
          </span>
          <span className="flex-1 truncate text-sm text-paper">{c.name}</span>
          {c.isDefault ? (
            <Lock size={14} className="text-slate-light shrink-0" />
          ) : (
            <button
              onClick={() => setDeleteTarget(c)}
              className="shrink-0 text-slate-light hover:text-rust"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <AppLayout title="Categories">
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setFormOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-gold px-4 py-2.5 text-sm font-semibold text-ink hover:bg-gold-light transition-colors"
        >
          <Plus size={16} />
          New Category
        </button>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-gold border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-8">
          <div>
            <h3 className="font-display text-lg text-paper mb-3">Expense Categories</h3>
            {renderGrid(expenseCats)}
          </div>
          <div>
            <h3 className="font-display text-lg text-paper mb-3">Income Categories</h3>
            {renderGrid(incomeCats)}
          </div>
        </div>
      )}

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title="New Category">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {['expense', 'income'].map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setForm((f) => ({ ...f, type: t }))}
                className={`rounded-lg py-2 text-sm font-medium capitalize transition-colors ${
                  form.type === t
                    ? 'bg-ledger/20 text-ledger-light border border-ledger/40'
                    : 'bg-ink border border-white/10 text-slate-light'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div>
            <label className={labelClass}>Name</label>
            <input
              className={inputClass}
              placeholder="e.g. Pet Care"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>

          <div>
            <label className={labelClass}>Icon</label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => setForm((f) => ({ ...f, icon: emoji }))}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-base transition-colors ${
                    form.icon === emoji ? 'bg-gold/20 border border-gold/50' : 'bg-ink border border-white/10'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass}>Color</label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((color) => (
                <button
                  type="button"
                  key={color}
                  onClick={() => setForm((f) => ({ ...f, color }))}
                  className="h-8 w-8 rounded-full ring-offset-2 ring-offset-ink-light transition-all"
                  style={{
                    backgroundColor: color,
                    boxShadow: form.color === color ? `0 0 0 2px ${color}` : 'none',
                  }}
                />
              ))}
            </div>
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
              {submitting ? 'Creating...' : 'Create Category'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this category?"
        message={`"${deleteTarget?.name}" will be permanently removed. This only works if no transactions use it.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AppLayout>
  );
};

export default Categories;
