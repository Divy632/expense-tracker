import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import AppLayout from '../components/AppLayout.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axios.js';
import { formatMoney, formatDateInput } from '../utils/format.js';

const startOfMonth = () => {
  const d = new Date();
  return formatDateInput(new Date(d.getFullYear(), d.getMonth(), 1));
};
const today = () => formatDateInput(new Date());

const inputClass =
  'rounded-lg bg-ink-light border border-white/10 px-3 py-2 text-sm text-paper focus:border-gold/60 focus:outline-none';

const Reports = () => {
  const { user } = useAuth();
  const currency = user?.currency || 'USD';
  const [range, setRange] = useState({ startDate: startOfMonth(), endDate: today() });
  const [type, setType] = useState('expense');
  const [breakdown, setBreakdown] = useState([]);
  const [total, setTotal] = useState(0);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ ...range, type });
        const [breakdownRes, trendRes] = await Promise.all([
          api.get(`/reports/category-breakdown?${params.toString()}`),
          api.get('/reports/trend?months=12'),
        ]);
        setBreakdown(breakdownRes.data.breakdown);
        setTotal(breakdownRes.data.total);
        setTrend(trendRes.data.series);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [range, type]);

  return (
    <AppLayout title="Reports">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-light">From</label>
          <input
            type="date"
            className={inputClass}
            value={range.startDate}
            onChange={(e) => setRange((r) => ({ ...r, startDate: e.target.value }))}
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-light">To</label>
          <input
            type="date"
            className={inputClass}
            value={range.endDate}
            onChange={(e) => setRange((r) => ({ ...r, endDate: e.target.value }))}
          />
        </div>
        <div className="flex rounded-lg border border-white/10 overflow-hidden">
          {['expense', 'income'].map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                type === t ? 'bg-gold text-ink' : 'bg-ink-light text-slate-light hover:text-paper'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-gold border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-ink-light border border-white/5 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg text-paper capitalize">{type} Breakdown</h3>
              <span className="font-mono text-sm text-slate-light">
                Total: {formatMoney(total, currency)}
              </span>
            </div>

            {breakdown.length === 0 ? (
              <p className="text-sm text-slate-light py-10 text-center">No data for this range.</p>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={breakdown} dataKey="total" nameKey="name" outerRadius={80} paddingAngle={2}>
                      {breakdown.map((entry) => (
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
                    <Legend wrapperStyle={{ fontSize: 12, color: '#8993AA' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-3 space-y-2">
                  {breakdown.map((c) => (
                    <div key={c.categoryId} className="flex items-center justify-between text-sm">
                      <span className="text-slate-light">
                        {c.icon} {c.name}
                      </span>
                      <span className="font-mono text-paper">
                        {formatMoney(c.total, currency)}{' '}
                        <span className="text-slate-light">({c.percent}%)</span>
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="rounded-2xl bg-ink-light border border-white/5 p-5">
            <h3 className="font-display text-lg text-paper mb-4">12-Month Trend</h3>
            <ResponsiveContainer width="100%" height={340}>
              <BarChart data={trend} margin={{ left: -20, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="label" stroke="#64708A" fontSize={11} />
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
                <Legend wrapperStyle={{ fontSize: 12, color: '#8993AA' }} />
                <Bar dataKey="income" fill="#2C8A73" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#B24C3A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default Reports;
