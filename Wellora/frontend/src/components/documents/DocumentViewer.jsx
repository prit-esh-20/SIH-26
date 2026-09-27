import { AnimatePresence, motion } from "framer-motion";
import { FileText, X, ShieldAlert } from "lucide-react";
import { getDocumentType } from "../../data/mockData.js";

export default function DocumentViewer({ document: doc, open, onClose }) {
  if (!doc) return null;

  return (
    <AnimatePresence>
      {open && (
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
            className="pointer-events-auto absolute right-0 top-0 flex h-full w-[520px] max-w-[92vw] flex-col border-l border-wl-border-strong bg-wl-surface"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-[57px] shrink-0 items-center justify-between border-b border-wl-border px-5">
              <div className="wl-panel-title">
                <FileText size={13} />
                <span>Document Viewer</span>
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
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-[20px] font-semibold tracking-wide">
                      {doc.documentId}
                    </span>
                    <span
                      className="flex items-center gap-1 px-1.5 py-0.5 text-[8.5px] font-semibold uppercase tracking-[0.1em] bg-wl-border/50 rounded-[3px] text-wl-text-muted"
                      title="Representative prototype data"
                    >
                      <ShieldAlert size={9} />
                      REPRESENTATIVE
                    </span>
                  </div>
                  <div className="mt-0.5 text-[11.5px] text-wl-text-muted">
                    {getDocumentType(doc.documentId)} · Page {doc.page}
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-2.5">
                <Field label="Well" value={doc.wellId} />
                <Field label="Date" value={doc.date} mono />
                <Field label="Formation" value={doc.formation} />
                <Field label="Type" value={doc.type} />
                <Field label="Depth" value={doc.depth ? `${doc.depth.toLocaleString("en-IN")} m` : "-"} mono />
                <Field label="Page" value={String(doc.page)} mono />
                <Field label="Status" value={doc.status} />
                {doc.eventType && <Field label="Related Event" value={doc.eventType} />}
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-wl-text-muted">
                    Document Content
                  </span>
                  <span className="text-[9.5px] uppercase tracking-[0.08em] text-wl-text-muted">
                    Representative prototype excerpt
                  </span>
                </div>
                <blockquote className="mt-2 rounded-[5px] border border-wl-border bg-wl-surface-2 px-4 py-3.5 text-[12.5px] leading-relaxed text-wl-text-primary">
                  {doc.excerpt ?? "Representative prototype document content. The original operator report is not connected in this prototype."}
                </blockquote>
              </div>

              <div className="mt-6 rounded-[5px] border border-wl-border bg-wl-surface-2/50 px-4 py-3">
                <div className="flex items-start gap-2">
                  <ShieldAlert size={12} className="mt-0.5 shrink-0 text-wl-accent" />
                  <div className="text-[10.5px] leading-relaxed text-wl-text-muted">
                    <span className="font-semibold text-wl-text-secondary">PROTOTYPE DATA NOTICE</span>
                    <br />
                    Representative prototype document created for SIH 2026 PS SIH26121.
                    This is not an actual OIL operator document. The document viewer with original
                    reports is planned for a later phase.
                  </div>
                </div>
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