import { useEffect } from "react";
import { X } from "lucide-react";

function Modal({ open, title, onClose, children, footer }) {
  useEffect(() => {
    if (!open) return undefined;

    const handleKey = (event) => {
      if (event.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title ?? "Dialog"}
      >
        {title && (
          <div className="modal-header">
            <h3 className="modal-title">{title}</h3>
            <button
              type="button"
              className="modal-close"
              onClick={onClose}
              aria-label="Close dialog"
            >
              <X size={16} />
            </button>
          </div>
        )}
        {children}
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

export default Modal;
