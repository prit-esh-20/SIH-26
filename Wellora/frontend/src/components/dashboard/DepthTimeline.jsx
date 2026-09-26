import { MoveDown } from "lucide-react";
import SectionHeader from "../common/SectionHeader.jsx";
import { useWellContext } from "../../context/WellContext.jsx";
import {
  comparableWells,
  getRiskAlerts,
  getWell,
  historicalEvents,
} from "../../data/mockData.js";

const SEVERITY_COLOR = {
  High: "#c84435",
  Medium: "#b97800",
  Low: "#3f7d55",
};

export default function DepthTimeline() {
  const { activeWellId } = useWellContext();
  const well = getWell(activeWellId);
  const alert = getRiskAlerts(activeWellId)[0] ?? null;
  if (!well) return null;

  const nearby = comparableWells
    .filter((c) => c.wellId !== activeWellId)
    .map((c) => c.wellId);

  const events = historicalEvents
    .filter((e) => nearby.includes(e.wellId) && e.depth >= 2740 && e.depth <= 2980)
    .sort((a, b) => a.depth - b.depth);

  const currentDepth = well.depth;
  const zone = alert?.riskInterval ?? null;

  const minDepth = Math.min(currentDepth, ...(zone ?? []), ...events.map((e) => e.depth)) - 20;
  const maxDepth =
    Math.max(currentDepth, ...(zone ?? [currentDepth]), ...events.map((e) => e.depth)) + 30;

  const span = maxDepth - minDepth || 1;
  const depthToPct = (d) => ((d - minDepth) / span) * 100;

  return (
    <section className="wl-card flex flex-col">
      <SectionHeader
        icon={MoveDown}
        title="Depth View, Events vs Current Depth"
        actions={
          <span className="text-[10.5px] text-wl-text-muted">
            {minDepth.toLocaleString("en-IN")} - {maxDepth.toLocaleString("en-IN")} m window
          </span>
        }
      />

      <div className="flex-1 px-5 py-4">
        <div className="relative ml-[92px] h-[380px] w-[3px] rounded-full bg-wl-border">
          {zone && (
            <div
              className="absolute left-1/2 w-[46px] -translate-x-1/2 rounded-[2px] border border-dashed"
              style={{
                top: `${depthToPct(zone[0])}%`,
                height: `${Math.max(depthToPct(zone[1]) - depthToPct(zone[0]), 2)}%`,
                borderColor: "rgba(200,68,53,0.5)",
                backgroundColor: "rgba(200,68,53,0.07)",
              }}
              title={`Historical risk zone ${zone[0].toLocaleString("en-IN")} - ${zone[1].toLocaleString("en-IN")} m`}
            />
          )}

          <div
            className="absolute -left-[86px] z-10 whitespace-nowrap rounded-[3px] border border-wl-accent-dark bg-wl-accent-light px-1.5 py-0.5 text-[10px] font-semibold text-wl-text-primary"
            style={{ top: `${depthToPct(currentDepth)}%`, transform: "translateY(-50%)" }}
          >
            {activeWellId} · {currentDepth.toLocaleString("en-IN")} m
          </div>
          <div
            className="absolute -left-[4px] z-10 h-[11px] w-[11px] -translate-y-1/2 rounded-full border-2 border-wl-surface bg-wl-accent"
            style={{ top: `${depthToPct(currentDepth)}%` }}
          />

          {events.map((e) => (
            <div
              key={e.id}
              className="absolute left-2 flex items-center gap-1.5 whitespace-nowrap"
              style={{ top: `${depthToPct(e.depth)}%`, transform: "translateY(-50%)" }}
            >
              <span
                className="inline-block h-[7px] w-[7px] rounded-full"
                style={{ backgroundColor: SEVERITY_COLOR[e.severity] }}
              />
              <span className="tabular font-mono text-[10.5px] text-wl-text-secondary">
                {e.depth.toLocaleString("en-IN")} m
              </span>
              <span className="text-[10.5px] text-wl-text-muted">{e.eventType}</span>
              <span className="text-[10.5px] font-medium text-wl-text-secondary">{e.wellId}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-wl-border px-4 py-2.5 text-[10px] text-wl-text-muted">
        Dashed band marks the historical risk interval from the active alert. Labels show depth, event type and well.
      </div>
    </section>
  );
}
