import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, RefreshCw, X } from "lucide-react";
import { StatusDot } from "../common/StatusIndicator.jsx";
import { getWell, wells } from "../../data/mockData.js";

export function ChangeWellModal({ open, onClose, currentWellId, onSelect }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[1400] flex items-center justify-center bg-[#17201D]/35 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ type: "tween", duration: 0.18, ease: "easeOut" }}
            className="w-[360px] max-w-full rounded-[6px] border border-wl-border-strong bg-wl-surface shadow-[0_16px_40px_rgba(23,32,29,0.18)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-[52px] items-center justify-between border-b border-wl-border px-5">
              <div className="wl-panel-title">
                <RefreshCw size={13} />
                <span>Change Current Well</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-7 w-7 items-center justify-center rounded-[4px] border border-wl-border text-wl-text-muted transition-colors duration-100 hover:border-wl-border-strong hover:text-wl-text-primary"
                title="Close"
              >
                <X size={14} />
              </button>
            </div>

            <div className="px-4 py-3">
              <div className="px-1 pb-1.5 text-[9.5px] font-semibold uppercase tracking-[0.12em] text-wl-text-muted">
                Select active well
              </div>
              {wells.map((w) => {
                const active = w.id === currentWellId;
                return (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => onSelect(w.id)}
                    className={`flex w-full items-center gap-3 rounded-[5px] px-3 py-2 text-left transition-colors duration-100 ${
                      active ? "bg-wl-accent-light" : "hover:bg-wl-surface-2"
                    }`}
                  >
                    <span className={`font-mono text-[12.5px] font-semibold ${active ? "text-wl-accent-dark" : "text-wl-text-primary"}`}>
                      {w.id}
                    </span>
                    <StatusDot status={w.status} />
                    <span className="text-[11px] text-wl-text-muted">{w.status}</span>
                    <span className="tabular ml-auto font-mono text-[11px] text-wl-text-secondary">
                      {w.depth.toLocaleString("en-IN")} m
                    </span>
                  </button>
                );
              })}
              <div className="mt-2 px-1 text-[10px] leading-relaxed text-wl-text-muted">
                Updates the Settings view and the shared current-well context used across pages.
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ResetConfirmDialog({ open, onClose, onReset }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[1400] flex items-center justify-center bg-[#17201D]/35 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ type: "tween", duration: 0.18, ease: "easeOut" }}
            className="w-[380px] max-w-full rounded-[6px] border border-wl-border-strong bg-wl-surface shadow-[0_16px_40px_rgba(23,32,29,0.18)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4">
              <div className="text-[14px] font-semibold text-wl-text-primary">Reset settings</div>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-wl-text-secondary">
                Reset all prototype settings to default values?
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-wl-border px-5 py-3.5">
              <button type="button" className="wl-btn" onClick={onClose}>
                Cancel
              </button>
              <button type="button" className="wl-btn wl-btn-primary" onClick={onReset}>
                Reset
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function SavedToast({ visible, onClose }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ type: "tween", duration: 0.18 }}
          className="fixed bottom-6 right-6 z-[1500] flex items-center gap-3 rounded-[6px] border border-wl-border-strong bg-wl-surface px-4 py-3 shadow-[0_16px_40px_rgba(23,32,29,0.18)]"
        >
          <CheckCircle2 size={15} className="shrink-0 text-[#3f7d55]" />
          <span className="pr-2 text-[12.5px] font-medium text-wl-text-primary">Settings saved.</span>
          <button
            type="button"
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded-[4px] border border-wl-border text-wl-text-muted transition-colors duration-100 hover:border-wl-border-strong hover:text-wl-text-primary"
            title="Dismiss"
          >
            <X size={12} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
