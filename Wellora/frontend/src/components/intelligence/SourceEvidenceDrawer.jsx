import { AnimatePresence, motion } from "framer-motion";
import { FileText, X } from "lucide-react";
import { getDocumentType } from "../../data/mockData.js";

export default function SourceEvidenceDrawer({ event, open, onClose }) {
  return (
    <AnimatePresence>
      {open && event && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="pointer-events-none fixed inset-0 z-[1400] bg-[#17201D]/35"
          onClick={onClose}
        >
          <motion.aside
            initial={{ x: 460 }}
            animate={{ x: 0 }}
            exit={{ x: 460 }}
            transition={{ type: "tween", duration: 0.22, ease: "easeOut" }}
            className="pointer-events-auto absolute right-0 top-0 flex h-full w-[440px] max-w-[92vw] flex-col border-l border-wl-border-strong bg-wl-surface"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-[57px] shrink-0 items-center justify-between border-b border-wl-border px-5">
              <div className="wl-panel-title">
                <FileText size={13} />
                <span>Historical Evidence</span>
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
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-wl-text-muted">
                    Source
                  </div>
                  <div className="mt-0.5 text-[20px] font-semibold tracking-wide">
                    {event.document}
                  </div>
                  <div className="mt-0.5 text-[11.5px] text-wl-text-muted">
                    {getDocumentType(event.document)} · Page {event.page}
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-2.5">
                <Field label="Well" value={event.wellId} />
                <Field label="Depth" value={`${event.depth.toLocaleString("en-IN")} m`} mono />
                <Field label="Formation" value={event.formation} />
                <Field label="Event" value={`${event.eventType}, ${event.severity}`} />
                <Field label="Date" value={event.date} mono />
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-wl-text-muted">
                    Document Excerpt
                  </span>
                  <span className="text-[9.5px] uppercase tracking-[0.08em] text-wl-text-muted">
                    Representative source excerpt
                  </span>
                </div>
                <blockquote className="mt-2 rounded-[5px] border border-wl-border bg-wl-surface-2 px-4 py-3.5 text-[12.5px] leading-relaxed text-wl-text-primary">
                  {event.excerpt}
                </blockquote>
              </div>

              <div className="mt-6 rounded-[5px] border border-wl-border px-4 py-3 text-[10.5px] leading-relaxed text-wl-text-muted">
                Representative prototype text for SIH 2026 problem statement SIH26121. Not an actual
                operator document. The document viewer with original reports is planned for a later phase.
              </div>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({ label, value, mono = false }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-wl-border/60 pb-2">
      <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-wl-text-muted">
        {label}
      </span>
      <span className={`text-[12.5px] font-medium text-wl-text-primary ${mono ? "tabular font-mono" : ""}`}>
        {value}
      </span>
    </div>
  );
}
