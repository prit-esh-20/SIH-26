import { AnimatePresence, motion } from "framer-motion";
import { FileText, X } from "lucide-react";
import SeverityChip from "./SeverityChip.jsx";

export default function EventDetailDrawer({ event, onClose }) {
  return (
    <AnimatePresence>
      {event && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[1400] bg-[#17201D]/35"
          onClick={onClose}
        >
          <motion.aside
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={{ type: "tween", duration: 0.22, ease: "easeOut" }}
            className="absolute right-0 top-0 flex h-full w-[400px] flex-col border-l border-wl-border-strong bg-wl-surface"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-[57px] shrink-0 items-center justify-between border-b border-wl-border px-5">
              <div className="wl-panel-title">
                <FileText size={13} />
                <span>Historical Event</span>
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
                    Event
                  </div>
                  <div className="mt-0.5 text-[20px] font-semibold tracking-wide">
                    {event.eventType}
                  </div>
                </div>
                <SeverityChip severity={event.severity} />
              </div>

              <div className="mt-5 space-y-3.5">
                <DrawerField label="Well" value={event.wellId} />
                <DrawerField
                  label="Depth"
                  value={`${event.depth.toLocaleString("en-IN")} m`}
                  mono
                />
                <DrawerField label="Formation" value={event.formation} />
                <DrawerField label="Severity" value={event.severity} />
                <DrawerField label="NPT" value={`${event.nptHours.toFixed(1)} hours`} mono />
                <DrawerField label="Mitigation" value={event.mitigation} />
                <DrawerField label="Outcome" value={event.outcome} />
                <DrawerField label="Date" value={event.date} mono />
              </div>

              <div className="mt-6 rounded-[5px] border border-wl-border bg-wl-surface-2 px-4 py-3.5">
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-wl-text-muted">
                  Source
                </div>
                <div className="mt-1.5 flex items-center gap-2 text-[13px] font-medium text-wl-text-primary">
                  <FileText size={13} className="text-wl-text-secondary" />
                  {event.document}
                </div>
                <div className="mt-0.5 text-[11.5px] text-wl-text-muted">
                  Page {event.page}
                </div>
                <button type="button" className="wl-btn mt-3" title="Source viewer is planned for a later phase">
                  View Source
                </button>
              </div>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DrawerField({ label, value, mono = false }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-wl-border/60 pb-2.5">
      <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-wl-text-muted">
        {label}
      </span>
      <span
        className={`text-right text-[12.5px] font-medium text-wl-text-primary ${mono ? "tabular font-mono" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
