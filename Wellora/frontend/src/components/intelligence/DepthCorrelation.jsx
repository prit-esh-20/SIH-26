import { ArrowDown } from "lucide-react";
import SectionHeader from "../common/SectionHeader.jsx";
import { useWellContext } from "../../context/WellContext.jsx";
import { getWell } from "../../data/mockData.js";

const SEVERITY_COLOR = {
  High: "#c84435",
  Medium: "#b97800",
  Low: "#3f7d55",
};

export default function DepthCorrelation({ selectedWellId, selectedEvent }) {
  const { activeWellId } = useWellContext();
  const current = getWell(activeWellId);

  if (!current || !selectedEvent) return null;

  const currentDepth = current.depth;
  const eventDepth = selectedEvent.depth;
  const gap = Math.abs(eventDepth - currentDepth);
  const eventBelow = eventDepth > currentDepth;

  return (
    <section className="wl-card flex flex-col">
      <SectionHeader
        icon={ArrowDown}
        title="Depth Correlation"
        actions={
          <span className="text-[10.5px] text-wl-text-muted">
            {activeWellId} vs {selectedWellId}
          </span>
        }
      />
      <div className="flex flex-1 items-center justify-center px-6 py-5">
        <div className="flex w-full max-w-[420px] items-stretch justify-center gap-5">
          {/* Current well side */}
          <div className="flex flex-1 flex-col items-center justify-center rounded-[5px] border border-wl-border bg-wl-surface-2 px-3 py-4 text-center">
            <div className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-wl-text-muted">
              Current Well
            </div>
            <div className="mt-1 text-[15px] font-semibold text-wl-text-primary">{activeWellId}</div>
            <div className="tabular mt-0.5 font-mono text-[13px] text-wl-accent-dark">
              {currentDepth.toLocaleString("en-IN")} m
            </div>
            <div className="mt-1 text-[10.5px] text-wl-text-muted">{current.formation}</div>
          </div>

          {/* Vertical distance */}
          <div className="flex w-[86px] flex-col items-center justify-center">
            <span
              aria-hidden="true"
              className="w-px flex-1"
              style={{ minHeight: 34, background: "linear-gradient(to bottom, var(--color-wl-accent), #c8ceca)" }}
            />
            <div className="tabular my-1 whitespace-nowrap rounded-[4px] border border-wl-border bg-wl-surface px-2 py-0.5 font-mono text-[11px] font-semibold text-wl-text-primary">
              {gap} m
            </div>
            <span
              aria-hidden="true"
              className="w-px flex-1"
              style={{ minHeight: 34, background: "linear-gradient(to bottom, #c8ceca, var(--color-wl-danger))" }}
            />
          </div>

          {/* Historical event side */}
          <div className="flex flex-1 flex-col items-center justify-center rounded-[5px] border border-wl-border bg-wl-surface-2 px-3 py-4 text-center">
            <div className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-wl-text-muted">
              Historical Event
            </div>
            <div className="mt-1 text-[13px] font-semibold text-wl-text-primary">
              {selectedEvent.eventType}
            </div>
            <div className="tabular mt-0.5 font-mono text-[13px]" style={{ color: SEVERITY_COLOR[selectedEvent.severity] }}>
              {eventDepth.toLocaleString("en-IN")} m
            </div>
            <div className="mt-1 text-[10.5px] text-wl-text-muted">
              {eventBelow ? "Below" : "Above"} current depth · {selectedEvent.severity}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-wl-border px-4 py-2.5 text-[10px] leading-relaxed text-wl-text-muted">
        Vertical separation between the current bit depth and the selected historical event.
      </div>
    </section>
  );
}
