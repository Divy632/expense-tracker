const toneStyles = {
  ledger: { bg: 'bg-ledger/12', text: 'text-ledger-light', bar: 'bg-ledger' },
  rust: { bg: 'bg-rust/12', text: 'text-rust-light', bar: 'bg-rust' },
  gold: { bg: 'bg-gold/12', text: 'text-gold-light', bar: 'bg-gold' },
};

const StatCard = ({ label, value, icon: Icon, tone = 'ledger', sub }) => {
  const t = toneStyles[tone] || toneStyles.ledger;
  return (
    <div className="relative overflow-hidden rounded-2xl bg-ink-light border border-white/5 p-5">
      <div className={`absolute left-0 top-0 h-full w-1 ${t.bar}`} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-light">{label}</p>
          <p className="mt-2 font-mono text-2xl font-semibold text-paper">{value}</p>
          {sub && <p className="mt-1 text-xs text-slate-light">{sub}</p>}
        </div>
        {Icon && (
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${t.bg} ${t.text}`}>
            <Icon size={18} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
