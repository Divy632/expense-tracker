import { Pencil, Trash2, Repeat } from 'lucide-react';
import { formatMoney, formatDate } from '../utils/format.js';

const paymentLabels = {
  cash: 'Cash',
  card: 'Card',
  upi: 'UPI',
  bank_transfer: 'Bank Transfer',
  wallet: 'Wallet',
  other: 'Other',
};

const ExpenseStub = ({ expense, currency, onEdit, onDelete }) => {
  const isIncome = expense.type === 'income';
  const accent = isIncome ? '#1F6F5C' : expense.category?.color || '#C9973E';

  return (
    <div
      className="group relative flex items-center gap-4 rounded-xl bg-paper pl-4 pr-3 py-3.5 shadow-stub border border-black/[0.04]"
      style={{ borderLeft: `3px solid ${accent}` }}
    >
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-lg"
        style={{ backgroundColor: `${accent}1F` }}
      >
        {expense.category?.icon || '📦'}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium text-ink">{expense.title}</p>
          {expense.isRecurring && <Repeat size={13} className="shrink-0 text-slate" />}
        </div>
        <p className="text-xs text-slate mt-0.5">
          {expense.category?.name} &middot; {paymentLabels[expense.paymentMethod]} &middot;{' '}
          {formatDate(expense.date)}
        </p>
      </div>

      <div className="text-right shrink-0">
        <p
          className={`font-mono font-semibold ${isIncome ? 'text-ledger-dark' : 'text-ink'}`}
        >
          {isIncome ? '+' : '-'}
          {formatMoney(expense.amount, currency)}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(expense)}
          className="rounded-md p-1.5 text-slate hover:bg-ink/5 hover:text-ledger"
          aria-label="Edit entry"
        >
          <Pencil size={15} />
        </button>
        <button
          onClick={() => onDelete(expense)}
          className="rounded-md p-1.5 text-slate hover:bg-rust/10 hover:text-rust"
          aria-label="Delete entry"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
};

export default ExpenseStub;
