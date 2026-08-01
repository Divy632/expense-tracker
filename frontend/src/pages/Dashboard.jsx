import { useEffect, useState } from 'react';
import { Wallet, TrendingDown, TrendingUp, PiggyBank } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import AppLayout from '../components/AppLayout.jsx';
import StatCard from '../components/StatCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axios.js';
import { formatMoney, formatDate } from '../utils/format.js';

const Dashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [summaryRes, trendRes] = await Promise.all([
          api.get('/reports/summary'),
          api.get('/reports/trend?months=6'),
        ]);
        setSummary(summaryRes.data);
        setTrend(trendRes.data.series);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const currency = user?.currency || 'USD';

  if (loading) {
    return (
      <AppLayout title="Dashboard">
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Dashboard">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          label="Total Balance"
          value={formatMoney(summary.allTime.balance, currency)}
          icon={Wallet}
          tone="gold"
        />
        <StatCard
          label="This Month Income"
          value={formatMoney(summary.thisMonth.income, currency)}
          icon={TrendingUp}
          tone="ledger"
        />
        <StatCard
          label="This Month Spent"
          value={formatMoney(summary.thisMonth.expense, currency)}
          icon={TrendingDown}
          tone="rust"
        />
        <StatCard
          label="Month Net"
          value={formatMoney(summary.thisMonth.balance, currency)}
          icon={PiggyBank}
          tone={summary.thisMonth.balance >= 0 ? 'ledger' : 'rust'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl bg-ink-light border border-white/5 p-5">
          <h3 className="font-display text-lg text-paper mb-4">Income vs. Spending — 6 months</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trend} margin={{ left: -20, right: 10 }}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2C8A73" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2C8A73" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#B24C3A" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#B24C3A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="label" stroke="#64708A" fontSize={12} />
              <YAxis stroke="#64708A" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: '#18243D',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(value) => formatMoney(value, currency)}
              />
              <Area type="monotone" dataKey="income" stroke="#2C8A73" fill="url(#incomeGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="expense" stroke="#B24C3A" fill="url(#expenseGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl bg-ink-light border border-white/5 p-5">
          <h3 className="font-display text-lg text-paper mb-4">Top Categories</h3>
          {summary.topCategories.length === 0 ? (
            <p className="text-sm text-slate-light">No spending recorded this month yet.</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={summary.topCategories}
                    dataKey="total"
                    nameKey="name"
                    innerRadius={40}
                    outerRadius={65}
                    paddingAngle={3}
                  >
                    {summary.topCategories.map((entry) => (
                      <Cell key={entry.categoryId} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#18243D',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    formatter={(value) => formatMoney(value, currency)}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 space-y-2">
                {summary.topCategories.map((c) => (
                  <div key={c.categoryId} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-light">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} />
                      {c.icon} {c.name}
                    </span>
                    <span className="font-mono text-paper">{formatMoney(c.total, currency)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-ink-light border border-white/5 p-5">
        <h3 className="font-display text-lg text-paper mb-4">Recent Activity</h3>
        <div className="space-y-2">
          {summary.recentExpenses.length === 0 && (
            <p className="text-sm text-slate-light">Nothing logged yet — add your first entry.</p>
          )}
          {summary.recentExpenses.map((e) => (
            <div key={e._id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-sm"
                  style={{ backgroundColor: `${e.category?.color || '#64708A'}20` }}
                >
                  {e.category?.icon || '📦'}
                </span>
                <div>
                  <p className="text-sm text-paper">{e.title}</p>
                  <p className="text-xs text-slate-light">{formatDate(e.date)}</p>
                </div>
              </div>
              <span className={`font-mono text-sm ${e.type === 'income' ? 'text-ledger-light' : 'text-rust-light'}`}>
                {e.type === 'income' ? '+' : '-'}
                {formatMoney(e.amount, currency)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
