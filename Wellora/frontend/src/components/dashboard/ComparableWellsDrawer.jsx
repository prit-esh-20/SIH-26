import { AnimatePresence, motion } from "framer-motion";
import { Users, X } from "lucide-react";
import { getComparableWells, getEventsForWell, getWell } from "../../data/mockData.js";

export default function ComparableWellsDrawer({ open, onClose, activeWellId }) {
  const comps = open ? getComparableWells(activeWellId).sort((a, b) => b.similarity - a.similarity) : [];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[1400] bg-[#17201D]/35 pointer-events-none"
          onClick={onClose}
        >
          <motion.aside
            initial={{ x: 460 }}
            animate={{ x: 0 }}
            exit={{ x: 460 }}
            transition={{ type: "tween", duration: 0.22, ease: "easeOut" }}
            className="pointer-events-auto absolute right-0 top-0 flex h-full w-[420px] max-w-[92vw] flex-col border-l border-wl-border-strong bg-wl-surface"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-[57px] shrink-0 items-center justify-between border-b border-wl-border px-5">
              <div className="wl-panel-title">
                <Users size={13} />
                <span>Comparable Wells</span>
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
              <div className="text-[12px] leading-relaxed text-wl-text-secondary">
                Offsets ranked by a representative combined similarity index covering geography,
                geology, depth interval, operational setup and event overlap.
              </div>

              <div className="mt-4 space-y-2.5">
                {comps.map((c) => {
                  const w = getWell(c.wellId);
                  const events = getEventsForWell(c.wellId);
                  return (
                    <div
                      key={c.wellId}
                      className="rounded-[5px] border border-wl-border bg-wl-surface-2 px-4 py-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[13.5px] font-semibold">{c.wellId}</span>
                        <span className="tabular font-mono text-[11.5px] text-wl-text-secondary">
                          {c.distanceKm.toFixed(1)} km
                        </span>
                      </div>
                      <div className="mt-1 text-[11.5px] text-wl-text-muted">
                        {w?.status} · {w?.depth.toLocaleString("en-IN")} m · Formation {c.formation}
                      </div>

                      <div className="mt-2.5 flex items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-[2px] bg-wl-surface-3">
                          <div
                            className="h-full rounded-[2px] bg-wl-accent"
                            style={{ width: `${c.similarity}%` }}
                          />
                        </div>
                        <span className="tabular font-mono text-[11.5px] text-wl-text-secondary">
                          {c.similarity}%
                        </span>
                      </div>

                      <div className="mt-2.5 border-t border-wl-border/70 pt-2">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-wl-text-muted">
                          Historical Events ({events.length})
                        </div>
                        <ul className="mt-1 space-y-0.5">
                          {events
                            .slice()
                            .sort((a, b) => a.depth - b.depth)
                            .map((e) => (
                              <li
                                key={e.id}
                                className="flex items-baseline justify-between gap-3 text-[11.5px]"
                              >
                                <span className="text-wl-text-primary">
                                  {e.eventType}
                                  <span className="text-wl-text-muted"> ({e.severity})</span>
                                </span>
                                <span className="tabular font-mono text-wl-text-secondary">
                                  {e.depth.toLocaleString("en-IN")} m
                                </span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
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
