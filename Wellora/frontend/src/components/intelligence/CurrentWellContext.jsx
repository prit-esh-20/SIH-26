import { Gauge, MapPin } from "lucide-react";
import SectionHeader from "../common/SectionHeader.jsx";
import { StatusIndicator } from "../common/StatusIndicator.jsx";
import MetricDisplay from "../common/MetricDisplay.jsx";
import { useWellContext } from "../../context/WellContext.jsx";
import { drillingParameters, getWell } from "../../data/mockData.js";

export default function CurrentWellContext() {
  const { activeWellId } = useWellContext();
  const well = getWell(activeWellId);
  const params = drillingParameters[activeWellId];
  const mudWeight = params?.find((p) => p.key === "mudWeight");

  return (
    <section className="wl-card">
      <SectionHeader
        icon={Gauge}
        title="Current Well"
        actions={<span className="text-[10.5px] text-wl-text-muted">Comparison baseline</span>}
      />
      <div className="flex flex-wrap items-center gap-x-10 gap-y-3 px-6 pb-4 pt-3.5">
        <div>
          <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-wl-text-muted">
            Well
          </div>
          <div className="mt-0.5 text-[22px] font-semibold leading-none tracking-wide">
            {well?.id}
          </div>
          <div className="mt-1.5">
            <StatusIndicator status={well?.status} blink={well?.status === "Drilling"} />
          </div>
        </div>

        <div className="h-11 w-px bg-wl-border" />

        <MetricDisplay label="Depth" value={(well?.depth ?? 0).toLocaleString("en-IN")} unit="m" />
        <MetricDisplay label="Formation" value={well?.formation ?? "-"} />
        <MetricDisplay label="Hole Section" value={well?.holeSection ?? "-"} />
        <MetricDisplay label="Current Mud Weight" value={mudWeight?.value.toFixed(2) ?? "-"} unit={mudWeight?.unit} />

        <div className="ml-auto flex items-center gap-2 text-[12px] text-wl-text-secondary">
          <MapPin size={13} className="text-wl-text-muted" />
          <span>{well?.location}</span>
        </div>
      </div>
    </section>
  );
}
