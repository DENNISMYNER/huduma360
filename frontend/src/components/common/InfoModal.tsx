interface InfoModalProps {
  info: { title: string; body: string } | null;
  onClose: () => void;
}

export default function InfoModal({ info, onClose }: InfoModalProps) {
  return (
    <div className={`modal-overlay${info ? " open" : ""}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal info-modal" role="dialog" aria-modal="true">
        <button className="modal-close" aria-label="Close" onClick={onClose}>
          &times;
        </button>
        {info && (
          <div className="modal-body">
            <div className="info-modal-title">{info.title}</div>
            <div className="info-modal-body">
              <p>{info.body}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
