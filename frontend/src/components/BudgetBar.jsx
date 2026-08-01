import { Trash2 } from 'lucide-react';
import { formatMoney } from '../utils/format.js';

const BudgetBar = ({ budget, currency, onDelete }) => {
  const pct = Math.min(100, budget.percentUsed);
  const over = budget.percentUsed > 100;
  const barColor = over ? 'bg-rust' : pct > 80 ? 'bg-gold' : 'bg-ledger';

  return (
    <div className="rounded-xl bg-ink-light border border-white/5 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg text-sm"
            style={{ backgroundColor: `${budget.category.color}20` }}
          >
            {budget.category.icon}
          </span>
          <span className="text-sm font-medium text-paper">{budget.category.name}</span>
        </div>
        <button onClick={() => onDelete(budget)} className="text-slate-light hover:text-rust">
          <Trash2 size={14} />
        </button>
      </div>

      <div className="h-2 w-full rounded-full bg-ink overflow-hidden mb-2">
        <div className={`h-full ${barColor} transition-all`} style={{ width: `${pct}%` }} />
      </div>

      <div className="flex justify-between text-xs">
        <span className={over ? 'text-rust-light font-medium' : 'text-slate-light'}>
          {formatMoney(budget.spent, currency)} spent
        </span>
        <span className="text-slate-light">of {formatMoney(budget.amount, currency)}</span>
      </div>
    </div>
  );
};

export default BudgetBar;
