import { MoveDown } from "lucide-react";
import SectionHeader from "../common/SectionHeader.jsx";
import { useWellContext } from "../../context/WellContext.jsx";
import {
  getRiskAlerts,
  getWell,
  getComparableWells,
  historicalEvents,
} from "../../data/mockData.js";

const SEVERITY_COLOR = {
  High: "#c84435",
  Medium: "#b97800",
  Low: "#3f7d55",
};

// Configurable depth window padding around current depth (meters)
const DEPTH_WINDOW_PADDING = 110;

// Target compact height range for the visualization
const MIN_VIZ_HEIGHT = 240;
const MAX_VIZ_HEIGHT = 340;
const EVENT_HEIGHT_INCREMENT = 18;

function getDepthLabel(status) {
  switch (status) {
    case "Drilling":
      return "Current Depth";
    case "Suspended":
      return "Suspended At";
    case "Completed":
    case "Plug and Abandon":
      return "Final Depth";
    default:
      return "Current Depth";
  }
}

export default function DepthTimeline() {
  const { activeWellId } = useWellContext();
  const well = getWell(activeWellId);
  const alert = getRiskAlerts(activeWellId)[0] ?? null;
  if (!well) return null;

  const comps = getComparableWells(activeWellId);
  const nearby = comps.map((c) => c.wellId);

  // Dynamic depth window centered on current depth
  const currentDepth = well.depth;
  const windowStart = currentDepth - DEPTH_WINDOW_PADDING;
  const windowEnd = currentDepth + DEPTH_WINDOW_PADDING;

  // Historical events from comparable wells within the dynamic depth window
  const events = historicalEvents
    .filter((e) => nearby.includes(e.wellId) && e.depth >= windowStart && e.depth <= windowEnd)
    .sort((a, b) => a.depth - b.depth);

  const zone = alert?.riskInterval ?? null;

  const minDepth = Math.min(currentDepth, ...(zone ?? []), ...events.map((e) => e.depth)) - 20;
  const maxDepth = Math.max(currentDepth, ...(zone ?? [currentDepth]), ...events.map((e) => e.depth)) + 30;

  const span = maxDepth - minDepth || 1;
  const depthToPct = (d) => ((d - minDepth) / span) * 100;

  // Content-driven height: base + small increment per event, clamped to range
  const eventCount = events.length;
  const calculatedHeight = Math.min(
    Math.max(MIN_VIZ_HEIGHT + eventCount * EVENT_HEIGHT_INCREMENT, MIN_VIZ_HEIGHT),
    MAX_VIZ_HEIGHT
  );

  const hasRelevantEvents = eventCount > 0;

  // Assign alternating sides for event labels (left/right of center axis)
  const eventsWithSide = events.map((e, idx) => ({
    ...e,
    side: idx % 2 === 0 ? "left" : "right",
  }));

  const depthLabel = getDepthLabel(well.status);
  const markerLabel = `${activeWellId} · ${currentDepth.toLocaleString("en-IN")} m`;

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

      <div className="px-5 py-4">
        {!hasRelevantEvents ? (
          <div
            className="relative w-full"
            style={{ minHeight: `${MIN_VIZ_HEIGHT}px`, maxHeight: `${MAX_VIZ_HEIGHT}px` }}
          >
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[3px] rounded-full bg-wl-border" />

            <div
              className="absolute left-1/2 w-[46px] -translate-x-1/2 rounded-[2px] border border-dashed"
              style={{
                top: `${depthToPct(currentDepth - 15)}%`,
                height: `${Math.max(depthToPct(currentDepth + 15) - depthToPct(currentDepth - 15), 8)}%`,
                borderColor: "rgba(200,68,53,0.5)",
                backgroundColor: "rgba(200,68,53,0.07)",
              }}
            />

            <div
              className="absolute left-1/2 -translate-x-1/2 z-10 whitespace-nowrap rounded-[3px] border border-wl-accent-dark bg-wl-accent-light px-1.5 py-0.5 text-[10px] font-semibold text-wl-text-primary"
              style={{ top: `${depthToPct(currentDepth)}%`, transform: "translate(-50%, -50%)" }}
            >
              {markerLabel}
            </div>
            <div
              className="absolute left-1/2 -translate-x-1/2 z-10 h-[11px] w-[11px] -translate-y-1/2 rounded-full border-2 border-wl-surface bg-wl-accent"
              style={{ top: `${depthToPct(currentDepth)}%` }}
            />

            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-[10.5px] text-wl-text-muted text-center">
              No historical events in the current depth window
            </div>
          </div>
        ) : (
          <div
            className="relative w-full"
            style={{ height: `${calculatedHeight}px` }}
          >
            {/* Central depth axis */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[3px] rounded-full bg-wl-border" />

            {/* Risk zone band on central axis */}
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

            {/* Current well marker on central axis */}
            <div
              className="absolute left-1/2 -translate-x-1/2 z-10 whitespace-nowrap rounded-[3px] border border-wl-accent-dark bg-wl-accent-light px-1.5 py-0.5 text-[10px] font-semibold text-wl-text-primary"
              style={{ top: `${depthToPct(currentDepth)}%`, transform: "translate(-50%, -50%)" }}
            >
              {markerLabel}
            </div>
            <div
              className="absolute left-1/2 -translate-x-1/2 z-10 h-[11px] w-[11px] -translate-y-1/2 rounded-full border-2 border-wl-surface bg-wl-accent"
              style={{ top: `${depthToPct(currentDepth)}%` }}
            />

            {/* Historical events alternating left/right */}
            {eventsWithSide.map((e) => (
              <div
                key={e.id}
                className={`absolute flex items-center gap-1.5 whitespace-nowrap ${
                  e.side === "left"
                    ? "right-1/2 justify-end mr-6"
                    : "left-1/2 ml-6"
                }`}
                style={{ top: `${depthToPct(e.depth)}%`, transform: "translateY(-50%)" }}
              >
                <span
                  className="inline-block h-[7px] w-[7px] rounded-full flex-shrink-0"
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
        )}
      </div>

      <div className="border-t border-wl-border px-4 py-2.5 text-[10px] text-wl-text-muted">
        Dashed band marks the historical risk interval from the active alert. Labels show depth, event type and well.
      </div>
    </section>
  );
}