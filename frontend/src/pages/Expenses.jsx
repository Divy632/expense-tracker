import { useCallback, useEffect, useState } from 'react';
import { Plus, Search, SlidersHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';
import AppLayout from '../components/AppLayout.jsx';
import ExpenseStub from '../components/ExpenseStub.jsx';
import ExpenseForm from '../components/ExpenseForm.jsx';
import Modal from '../components/Modal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import Pagination from '../components/Pagination.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axios.js';

const Expenses = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ type: '', category: '', paymentMethod: '' });
  const [showFilters, setShowFilters] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadCategories = useCallback(async () => {
    const { data } = await api.get('/categories');
    setCategories(data.categories);
  }, []);

  const loadExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (search) params.set('search', search);
      if (filters.type) params.set('type', filters.type);
      if (filters.category) params.set('category', filters.category);
      if (filters.paymentMethod) params.set('paymentMethod', filters.paymentMethod);

      const { data } = await api.get(`/expenses?${params.toString()}`);
      setExpenses(data.expenses);
      setPages(data.pages);
      setTotal(data.total);
    } catch {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [page, search, filters]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    try {
      if (editing) {
        await api.put(`/expenses/${editing._id}`, payload);
        toast.success('Entry updated');
      } else {
        await api.post('/expenses', payload);
        toast.success('Entry added to ledger');
      }
      setFormOpen(false);
      setEditing(null);
      loadExpenses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/expenses/${deleteTarget._id}`);
      toast.success('Entry deleted');
      setDeleteTarget(null);
      loadExpenses();
    } catch {
      toast.error('Failed to delete entry');
    }
  };

  return (
    <AppLayout title="Transactions">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-light" />
          <input
            className="w-full rounded-lg bg-ink-light border border-white/10 pl-9 pr-3 py-2.5 text-sm text-paper placeholder:text-slate-light focus:border-gold/60 focus:outline-none"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
        </div>
        <button
          onClick={() => setShowFilters((s) => !s)}
          className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
            showFilters ? 'border-gold/50 text-gold' : 'border-white/10 text-slate-light hover:text-paper'
          }`}
        >
          <SlidersHorizontal size={15} />
          Filters
        </button>
        <button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="flex items-center justify-center gap-2 rounded-lg bg-gold px-4 py-2.5 text-sm font-semibold text-ink hover:bg-gold-light transition-colors"
        >
          <Plus size={16} />
          Add Entry
        </button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5 rounded-xl bg-ink-light border border-white/5 p-4">
          <select
            className="rounded-lg bg-ink border border-white/10 px-3 py-2 text-sm text-paper"
            value={filters.type}
            onChange={(e) => {
              setPage(1);
              setFilters((f) => ({ ...f, type: e.target.value }));
            }}
          >
            <option value="">All types</option>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <select
            className="rounded-lg bg-ink border border-white/10 px-3 py-2 text-sm text-paper"
            value={filters.category}
            onChange={(e) => {
              setPage(1);
              setFilters((f) => ({ ...f, category: e.target.value }));
            }}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
          <select
            className="rounded-lg bg-ink border border-white/10 px-3 py-2 text-sm text-paper"
            value={filters.paymentMethod}
            onChange={(e) => {
              setPage(1);
              setFilters((f) => ({ ...f, paymentMethod: e.target.value }));
            }}
          >
            <option value="">All payment methods</option>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="upi">UPI</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="wallet">Wallet</option>
            <option value="other">Other</option>
          </select>
        </div>
      )}

      <p className="text-xs text-slate-light mb-3">{total} total entries</p>

      <div className="space-y-2.5">
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-gold border-t-transparent" />
          </div>
        ) : expenses.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 py-16 text-center">
            <p className="text-slate-light text-sm">No transactions match your search yet.</p>
          </div>
        ) : (
          expenses.map((expense) => (
            <ExpenseStub
              key={expense._id}
              expense={expense}
              currency={user?.currency}
              onEdit={(exp) => {
                setEditing(exp);
                setFormOpen(true);
              }}
              onDelete={setDeleteTarget}
            />
          ))
        )}
      </div>

      <Pagination page={page} pages={pages} onChange={setPage} />

      <Modal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        title={editing ? 'Edit Entry' : 'Add New Entry'}
      >
        <ExpenseForm
          initialData={editing}
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={() => {
            setFormOpen(false);
            setEditing(null);
          }}
          submitting={submitting}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this entry?"
        message={`This will permanently remove "${deleteTarget?.title}" from your ledger.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AppLayout>
  );
};

export default Expenses;
