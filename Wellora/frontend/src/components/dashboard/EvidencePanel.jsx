import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, FileText, X } from "lucide-react";
import { getAlertEvidence } from "../../data/mockData.js";

export default function EvidencePanel({ alert, open, onClose, focus }) {
  const evidence = alert ? getAlertEvidence(alert) : [];

  return (
    <AnimatePresence>
      {open && alert && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[1400] bg-[#17201D]/35 pointer-events-none"
          onClick={onClose}
        >
          <motion.aside
            initial={{ x: 480 }}
            animate={{ x: 0 }}
            exit={{ x: 480 }}
            transition={{ type: "tween", duration: 0.22, ease: "easeOut" }}
            className="pointer-events-auto absolute right-0 top-0 flex h-full w-[460px] max-w-[92vw] flex-col border-l border-wl-border-strong bg-wl-surface"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-[57px] shrink-0 items-center justify-between border-b border-wl-border px-5">
              <div className="wl-panel-title">
                <AlertTriangle size={13} />
                <span>Alert Evidence</span>
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

            <div className="flex-1 overflow-y-auto px-5 py-5">
              <div className="text-[17px] font-semibold tracking-wide" style={{ color: "#c84435" }}>
                {alert.severity} {alert.riskType} Risk
              </div>
              <div className="tabular mt-0.5 text-[12px] text-wl-text-secondary">
                Risk estimate {Math.round(alert.riskScore * 100)}% · Confidence{" "}
                {Math.round(alert.confidence * 100)}%
              </div>

              <div className="mt-5">
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-wl-text-muted">
                  Why this alert
                </div>
                <ul className="mt-2 space-y-1.5">
                  {alert.basis.map((b) => (
                    <li key={b.label} className="flex items-start gap-2 text-[12px]">
                      <span
                        className="mt-[5px] inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: b.present ? "#c84435" : "#b3bab6" }}
                      />
                      <span className="text-wl-text-primary">
                        {b.label}
                        {b.detail && <span className="text-wl-text-secondary"> ({b.detail})</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-wl-text-muted">
                  Historical Evidence
                </div>
                <div className="mt-2 space-y-2">
                  {evidence.map((ev) => (
                    <div
                      key={`${ev.wellId}-${ev.depth}`}
                      className="rounded-[5px] border border-wl-border bg-wl-surface-2 px-3.5 py-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-semibold">{ev.wellId}</span>
                        <span className="tabular font-mono text-[11.5px] text-wl-text-secondary">
                          {ev.depth.toLocaleString("en-IN")} m
                        </span>
                      </div>
                      <div className="mt-1 text-[12px] text-wl-text-secondary">
                        {ev.eventType}
                      </div>
                      <div className="mt-2 flex items-center gap-2 border-t border-wl-border/60 pt-2 text-[11px] text-wl-text-muted">
                        <FileText size={11} />
                        <span>{ev.document}</span>
                        <span>Page {ev.page}</span>
                      </div>
                      <button type="button" className="wl-btn mt-2.5 !py-1 !text-[10px]" title="Source viewer is planned for a later phase">
                        View Source
                      </button>
                    </div>
                  ))}
                  {!evidence.length && (
                    <div className="text-[12px] text-wl-text-muted">
                      No linked evidence records.
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 rounded-[5px] border border-wl-border bg-wl-surface-2 px-4 py-3.5">
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-wl-text-muted">
                  Historical Mitigation
                </div>
                <div className="mt-2 space-y-1.5">
                  {alert.mitigation.map((m) => (
                    <div key={m.wellId} className="flex items-baseline justify-between gap-3 text-[12px]">
                      <span className="font-medium text-wl-text-primary">{m.wellId}</span>
                      <span className="text-right text-wl-text-secondary">{m.action}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 border-t border-wl-border pt-2.5 text-[11px] leading-relaxed text-wl-text-secondary">
                  Review historical mitigation procedures with the drilling team. The engineer makes the final decision.
                </div>
              </div>

              <div className="mt-4 text-[10px] leading-relaxed text-wl-text-muted">
                Values shown are representative prototype data for SIH 2026 problem statement SIH26121.
              </div>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
