import { Activity } from "lucide-react";
import SectionHeader from "../common/SectionHeader.jsx";
import SeverityChip from "../common/SeverityChip.jsx";
import { getEventsForWell } from "../../data/mockData.js";

const SEVERITY_COLOR = {
  High: "#c84435",
  Medium: "#b97800",
  Low: "#3f7d55",
};

export default function HistoricalEventTimeline({ selectedWellId, selectedEventId, onSelectEvent }) {
  const events = getEventsForWell(selectedWellId)
    .slice()
    .sort((a, b) => a.depth - b.depth);

  return (
    <section className="wl-card flex flex-col">
      <SectionHeader
        icon={Activity}
        title="Historical Events"
        actions={
          <span className="text-[10.5px] text-wl-text-muted">
            {events.length} event{events.length === 1 ? "" : "s"}, depth ordered
          </span>
        }
      />
      <div className="px-5 py-4">
        {events.length ? (
          <div className="relative ml-[6px] border-l-2 border-wl-border pl-6">
            {events.map((e) => {
              const selected = e.id === selectedEventId;
              return (
                <div key={e.id} className="relative pb-4 last:pb-0">
                  <span
                    aria-hidden="true"
                    className="absolute -left-[31px] top-[10px] h-[9px] w-[9px] rounded-full border-2 border-wl-surface"
                    style={{ backgroundColor: SEVERITY_COLOR[e.severity] }}
                  />
                  <button
                    type="button"
                    onClick={() => onSelectEvent(e.id)}
                    className={`w-full rounded-[5px] border px-4 py-3 text-left transition-colors duration-100 ${
                      selected
                        ? "border-wl-accent-dark bg-wl-accent-light"
                        : "border-wl-border bg-wl-surface-2 hover:border-wl-border-strong"
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="tabular font-mono text-[13px] font-semibold text-wl-text-primary">
                        {e.depth.toLocaleString("en-IN")} m
                      </span>
                      <span className="text-[12.5px] font-semibold uppercase tracking-[0.06em] text-wl-text-primary">
                        {e.eventType}
                      </span>
                      <SeverityChip severity={e.severity} />
                      <span className="tabular ml-auto font-mono text-[11px] text-wl-text-muted">
                        NPT {e.nptHours.toFixed(1)} h
                      </span>
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-0.5 text-[11.5px] text-wl-text-secondary">
                      <span>
                        Mitigation: <span className="text-wl-text-primary">{e.mitigation}</span>
                      </span>
                      <span>
                        Outcome: <span className="text-wl-text-primary">{e.outcome}</span>
                      </span>
                    </div>
                    <div className="mt-1 text-[10.5px] text-wl-text-muted">
                      {e.document} · Page {e.page} · {e.date}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-6 text-center text-[12px] text-wl-text-muted">
            No historical events recorded for this well.
          </div>
        )}
      </div>
    </section>
  );
}
