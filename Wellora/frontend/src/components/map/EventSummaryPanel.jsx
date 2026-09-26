import { Activity } from "lucide-react";
import SectionHeader from "../common/SectionHeader.jsx";
import { useWellContext } from "../../context/WellContext.jsx";
import { getComparableWells, getEventsForWell } from "../../data/mockData.js";

export default function EventSummaryPanel({ activeWellId, eventFilter, onEventFilter }) {
  const { } = useWellContext();
  const comps = getComparableWells(activeWellId);

  const counts = {};
  for (const c of comps) {
    for (const e of getEventsForWell(c.wellId)) {
      counts[e.eventType] = (counts[e.eventType] ?? 0) + 1;
    }
  }
  const rows = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const total = rows.reduce((s, [, n]) => s + n, 0);

  return (
    <section className="wl-card flex flex-col">
      <SectionHeader
        icon={Activity}
        title="Historical Events Near Current Well"
        actions={<span className="text-[10.5px] text-wl-text-muted">{total} total</span>}
      />
      <div className="flex-1 px-5 py-4">
        {rows.length ? (
          <div className="space-y-1.5">
            {rows.map(([type, n]) => (
              <button
                key={type}
                type="button"
                onClick={() => onEventFilter(eventFilter === type ? "all" : type)}
                className={`flex w-full items-center justify-between rounded-[4px] border px-3 py-1.5 text-left transition-colors duration-100 ${
                  eventFilter === type
                    ? "border-wl-accent-dark bg-wl-accent-light"
                    : "border-transparent hover:bg-wl-surface-2"
                }`}
                title={eventFilter === type ? "Clear event filter" : `Filter map by ${type}`}
              >
                <span className="text-[12.5px] font-medium text-wl-text-primary">{type}</span>
                <span className="tabular font-mono text-[12.5px] font-semibold text-wl-text-secondary">
                  {n}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="py-4 text-center text-[12px] text-wl-text-muted">
            No events recorded for nearby wells.
          </div>
        )}
      </div>
      <div className="border-t border-wl-border px-4 py-2.5 text-[10px] leading-relaxed text-wl-text-muted">
        Representative prototype data. Click a type to filter the map.
      </div>
    </section>
  );
}
