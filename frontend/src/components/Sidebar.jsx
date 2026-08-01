import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  Tags,
  PiggyBank,
  BarChart3,
  Settings,
  BookOpen,
} from 'lucide-react';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/expenses', label: 'Transactions', icon: Receipt },
  { to: '/categories', label: 'Categories', icon: Tags },
  { to: '/budgets', label: 'Budgets', icon: PiggyBank },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
];

const Sidebar = () => {
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col bg-ink-light border-r border-white/5 px-5 py-6">
      <div className="flex items-center gap-2 px-2 mb-10">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/15 text-gold">
          <BookOpen size={18} strokeWidth={2.2} />
        </div>
        <div>
          <p className="font-display text-lg text-paper leading-none">Ledger</p>
          <p className="text-[11px] tracking-wide text-slate-light">EXPENSE TRACKER</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-ledger/15 text-ledger-light'
                  : 'text-slate-light hover:bg-white/5 hover:text-paper'
              }`
            }
          >
            <Icon size={18} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="rounded-xl bg-ledger-lines border border-white/5 p-4">
        <p className="font-display text-sm text-paper mb-1">Keep the ledger balanced</p>
        <p className="text-xs text-slate-light leading-relaxed">
          Log every entry as it happens — a clean ledger makes month-end painless.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
