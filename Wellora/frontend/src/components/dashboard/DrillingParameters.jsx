import { Activity } from "lucide-react";
import SectionHeader from "../common/SectionHeader.jsx";
import { useWellContext } from "../../context/WellContext.jsx";
import { drillingParameters, getWell } from "../../data/mockData.js";

export default function DrillingParameters() {
  const { activeWellId } = useWellContext();
  const well = getWell(activeWellId);
  const params = drillingParameters[activeWellId];

  if (!params) {
    return (
      <section className="wl-card flex flex-col">
        <SectionHeader
          icon={Activity}
          title="Drilling Parameters"
          actions={<span className="text-[10.5px] text-wl-text-muted">Snapshot</span>}
        />
        <div className="flex-1 flex items-center justify-center px-4 py-8 text-center text-[12.5px] text-wl-text-muted">
          No drilling parameter snapshot available for {activeWellId}.
        </div>
      </section>
    );
  }

  return (
    <section className="wl-card flex flex-col">
      <SectionHeader
        icon={Activity}
        title="Drilling Parameters"
        actions={<span className="text-[10.5px] text-wl-text-muted">Snapshot</span>}
      />
      <div className="grid grid-cols-3 gap-x-4 gap-y-4 px-5 py-5">
        {params.map((p) => (
          <div key={p.key} className="min-w-0">
            <div className="truncate text-[10px] font-medium uppercase tracking-[0.1em] text-wl-text-muted">
              {p.label}
            </div>
            <div className="tabular mt-0.5 flex items-baseline gap-1">
              <span className="font-mono text-[15px] font-semibold">
                {p.value.toLocaleString("en-IN")}
              </span>
              <span className="text-[10.5px] text-wl-text-muted">{p.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
