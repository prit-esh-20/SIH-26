import { Gauge, MapPin, Navigation } from "lucide-react";
import MetricDisplay from "../common/MetricDisplay.jsx";
import { StatusIndicator } from "../common/StatusIndicator.jsx";
import SectionHeader from "../common/SectionHeader.jsx";
import { useWellContext } from "../../context/WellContext.jsx";
import { getWell } from "../../data/mockData.js";

export default function CurrentWell() {
  const { activeWellId } = useWellContext();
  const well = getWell(activeWellId);

  return (
    <section className="wl-card">
      <SectionHeader
        icon={Gauge}
        title="Current Well"
        actions={
          <span className="text-[10.5px] text-wl-text-muted">
            Rig {well?.rig} · Spud {well?.spudDate}
          </span>
        }
      />
      <div className="flex flex-wrap items-end gap-x-10 gap-y-5 px-6 pb-6 pt-4">
        <div>
          <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-wl-text-muted">
            Well
          </div>
          <div className="mt-0.5 text-[28px] font-semibold leading-none tracking-wide">
            {well?.id}
          </div>
          <div className="mt-2">
            <StatusIndicator status={well?.status} blink={well?.status === "Drilling"} />
          </div>
        </div>

        <div className="h-14 w-px bg-wl-border" />

        <MetricDisplay label="Depth" value={(well?.depth ?? 0).toLocaleString("en-IN")} unit="m" size="lg" />
        <MetricDisplay label="Formation" value={well?.formation ?? "-"} size="lg" />
        <MetricDisplay label="Hole Section" value={well?.holeSection ?? "-"} size="lg" />

        <div className="ml-auto flex items-center gap-9">
          <div className="flex items-center gap-2 text-[12px] text-wl-text-secondary">
            <MapPin size={13} className="text-wl-text-muted" />
            <span>{well?.location}</span>
          </div>
          <div className="flex items-center gap-2 text-[12px] text-wl-text-secondary">
            <Navigation size={13} className="text-wl-text-muted" />
            <span className="tabular font-mono text-[12px]">
              {well?.coordinates[0].toFixed(4)}° N, {well?.coordinates[1].toFixed(4)}° E
            </span>
          </div>
          <div>
            <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-wl-text-muted">
              Last Update
            </div>
            <div className="tabular mt-0.5 font-mono text-[13px]">{well?.lastUpdate}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
