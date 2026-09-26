import { Activity, ArrowDown, GitCompare, Layers, MapPin } from "lucide-react";
import SectionHeader from "../common/SectionHeader.jsx";
import { useWellContext } from "../../context/WellContext.jsx";
import {
  formations,
  getComparableEntry,
  getEventsForWell,
  getWell,
} from "../../data/mockData.js";

export default function WhyComparable({ selectedWellId }) {
  const { activeWellId } = useWellContext();
  const current = getWell(activeWellId);
  const entry = getComparableEntry(selectedWellId);
  const events = getEventsForWell(selectedWellId);

  const factors = [
    {
      icon: MapPin,
      label: "Geographic",
      detail: entry
        ? `${entry.distanceKm.toFixed(1)} km from the current well`
        : "Distance data unavailable",
    },
    {
      icon: Layers,
      label: "Geological",
      detail: entry
        ? `${entry.formation === current?.formation ? "Same formation" : "Adjacent formation"}: ${entry.formation} (${formations[entry.formation]?.lithology ?? "representative lithology"})`
        : "Formation data unavailable",
    },
    {
      icon: ArrowDown,
      label: "Depth",
      detail: entry
        ? `Relevant interval ${entry.relevantInterval[0].toLocaleString("en-IN")} - ${entry.relevantInterval[1].toLocaleString("en-IN")} m overlaps the current drilling interval`
        : "Interval data unavailable",
    },
    {
      icon: GitCompare,
      label: "Operational",
      detail:
        current && entry
          ? `Comparable hole section (${current.holeSection}) and drilling conditions`
          : "Operational data unavailable",
    },
    {
      icon: Activity,
      label: "Historical Events",
      detail: events.length
        ? `${events.length} drilling event${events.length === 1 ? "" : "s"} recorded under comparable conditions`
        : "No comparable events recorded",
    },
  ];

  return (
    <section className="wl-card flex flex-col">
      <SectionHeader icon={GitCompare} title="Why This Well Is Comparable" />
      <div className="grid flex-1 grid-cols-1 gap-3 px-5 py-4 sm:grid-cols-2 xl:grid-cols-5">
        {factors.map((f) => (
          <div
            key={f.label}
            className="rounded-[5px] border border-wl-border bg-wl-surface-2 px-3.5 py-3"
          >
            <div className="flex items-center gap-2">
              <f.icon size={13} className="text-wl-accent-dark" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-wl-text-secondary">
                {f.label}
              </span>
            </div>
            <div className="mt-1.5 text-[11.5px] leading-relaxed text-wl-text-primary">
              {f.detail}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
