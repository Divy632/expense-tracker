import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ page, pages, onChange }) => {
  if (pages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-light disabled:opacity-30 hover:bg-white/5"
      >
        <ChevronLeft size={16} />
      </button>
      <span className="px-3 text-sm text-slate-light">
        Page <span className="text-paper font-medium">{page}</span> of {pages}
      </span>
      <button
        onClick={() => onChange(Math.min(pages, page + 1))}
        disabled={page === pages}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-light disabled:opacity-30 hover:bg-white/5"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
