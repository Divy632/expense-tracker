import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard, Receipt, Tags, PiggyBank, BarChart3, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const mobileLinks = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/expenses', label: 'Transactions', icon: Receipt },
  { to: '/categories', label: 'Categories', icon: Tags },
  { to: '/budgets', label: 'Budgets', icon: PiggyBank },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
];

const Topbar = ({ title }) => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/5 bg-ink/90 backdrop-blur px-5 py-4 md:px-8">
      <div className="flex items-center gap-3">
        <button
          className="md:hidden text-paper"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <h1 className="font-display text-xl md:text-2xl text-paper">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div
          className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full font-display text-sm text-ink font-semibold"
          style={{ backgroundColor: user?.avatarColor || '#C9973E' }}
        >
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <span className="hidden sm:block text-sm text-paper">{user?.name}</span>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-light hover:border-rust/40 hover:text-rust transition-colors"
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-30 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMenuOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-ink-light p-5">
            <div className="flex items-center justify-between mb-8">
              <span className="font-display text-lg text-paper">Ledger</span>
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <X size={20} className="text-paper" />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {mobileLinks.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                      isActive ? 'bg-ledger/15 text-ledger-light' : 'text-slate-light'
                    }`
                  }
                >
                  <Icon size={18} />
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Topbar;
