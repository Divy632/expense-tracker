import { X } from 'lucide-react';
import { useEffect } from 'react';

const Modal = ({ open, onClose, title, children, maxWidth = 'max-w-md' }) => {
  useEffect(() => {
    const handleEsc = (e) => e.key === 'Escape' && onClose();
    if (open) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative w-full ${maxWidth} rounded-2xl bg-ink-light border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
          <h2 className="font-display text-lg text-paper">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-light hover:bg-white/5 hover:text-paper"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
