import Modal from './Modal.jsx';

const ConfirmDialog = ({ open, title, message, onConfirm, onCancel, confirmLabel = 'Delete' }) => {
  return (
    <Modal open={open} onClose={onCancel} title={title} maxWidth="max-w-sm">
      <p className="text-sm text-slate-light leading-relaxed">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="rounded-lg px-4 py-2 text-sm font-medium text-slate-light hover:bg-white/5"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="rounded-lg bg-rust px-4 py-2 text-sm font-medium text-white hover:bg-rust-dark transition-colors"
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
