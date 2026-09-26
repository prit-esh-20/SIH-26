import { GitCompare } from "lucide-react";
import SectionHeader from "../common/SectionHeader.jsx";
import { useWellContext } from "../../context/WellContext.jsx";
import {
  drillingParameters,
  drillingParametersFallback,
  getComparableEntry,
  getWell,
} from "../../data/mockData.js";

function Row({ label, current, historical, difference }) {
  return (
    <tr className="border-b border-wl-border/70 last:border-0">
      <td className="px-4 py-[7px] font-medium text-wl-text-primary">{label}</td>
      <td className="tabular px-4 py-[7px] font-mono text-[12px] text-wl-text-primary">{current}</td>
      <td className="tabular px-4 py-[7px] font-mono text-[12px] text-wl-text-primary">{historical}</td>
      <td className="tabular px-4 py-[7px] font-mono text-[12px] text-wl-text-secondary">{difference}</td>
    </tr>
  );
}

export default function WellComparison({ selectedWellId, selectedEvent }) {
  const { activeWellId } = useWellContext();
  const current = getWell(activeWellId);
  const historical = getWell(selectedWellId);
  const entry = getComparableEntry(selectedWellId);

  const currentParams = drillingParameters[activeWellId] ?? drillingParametersFallback;
  const cur = (key) => currentParams.find((p) => p.key === key)?.value ?? "-";

  // Event-level parameters when an event is selected, otherwise well snapshot.
  const ep = selectedEvent?.params;
  const fmt = (v, digits = 1) => (typeof v === "number" ? v.toFixed(digits) : "-");
  const diff = (a, b) =>
    typeof a === "number" && typeof b === "number" ? (a - b >= 0 ? "+" : "") + (a - b).toFixed(1) : "-";

  const rows = [
    {
      label: selectedEvent ? "Depth" : "Current depth",
      current: `${(current?.depth ?? 0).toLocaleString("en-IN")} m`,
      historical: selectedEvent
        ? `${selectedEvent.depth.toLocaleString("en-IN")} m`
        : entry
          ? `${entry.relevantInterval[0].toLocaleString("en-IN")} - ${entry.relevantInterval[1].toLocaleString("en-IN")} m`
          : "-",
      difference:
        selectedEvent && current ? `${selectedEvent.depth - current.depth >= 0 ? "+" : ""}${selectedEvent.depth - current.depth} m` : "-",
    },
    { label: "ROP", current: `${fmt(cur("rop"))} m/hr`, historical: `${fmt(ep?.rop)} m/hr`, difference: diff(cur("rop"), ep?.rop) },
    { label: "WOB", current: `${fmt(cur("wob"))} klb`, historical: `${fmt(ep?.wob)} klb`, difference: diff(cur("wob"), ep?.wob) },
    { label: "RPM", current: `${cur("rpm")} rpm`, historical: ep ? `${ep.rpm} rpm` : "-", difference: diff(cur("rpm"), ep?.rpm) },
    { label: "Torque", current: `${fmt(cur("torque"))} kNm`, historical: `${fmt(ep?.torque)} kNm`, difference: diff(cur("torque"), ep?.torque) },
    {
      label: "Mud Weight",
      current: `${fmt(cur("mudWeight"), 2)} SG`,
      historical: `${fmt(ep?.mudWeight, 2)} SG`,
      difference: diff(cur("mudWeight"), ep?.mudWeight),
    },
    { label: "Flow Rate", current: `${cur("flowRate")} L/min`, historical: ep ? `${ep.flowRate} L/min` : "-", difference: diff(cur("flowRate"), ep?.flowRate) },
    { label: "Pressure", current: `${(cur("standpipe") ?? 0).toLocaleString("en-IN")} psi`, historical: ep ? `${ep.standpipe.toLocaleString("en-IN")} psi` : "-", difference: diff(cur("standpipe"), ep?.standpipe) },
  ];

  return (
    <section className="wl-card flex flex-col">
      <SectionHeader
        icon={GitCompare}
        title={`Current Well vs ${selectedWellId}`}
        actions={
          <span className="text-[10.5px] text-wl-text-muted">
            {selectedEvent ? `At selected event, ${selectedEvent.depth.toLocaleString("en-IN")} m` : "Well snapshot"}
          </span>
        }
      />
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[12px]">
          <thead>
            <tr className="border-b border-wl-border bg-wl-surface-2">
              <th className="wl-table-head px-4 py-2">Parameter</th>
              <th className="wl-table-head px-4 py-2">Current {activeWellId}</th>
              <th className="wl-table-head px-4 py-2">Historical {selectedWellId}</th>
              <th className="wl-table-head px-4 py-2">Difference</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <Row key={r.label} {...r} />
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-wl-border px-4 py-2.5 text-[10px] leading-relaxed text-wl-text-muted">
        Differences are indicative. Historical values are representative conditions recorded at the selected event.
      </div>
    </section>
  );
}
