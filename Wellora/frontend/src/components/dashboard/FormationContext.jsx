import { Layers } from "lucide-react";
import SectionHeader from "../common/SectionHeader.jsx";
import { useWellContext } from "../../context/WellContext.jsx";
import { getFormationContext } from "../../data/mockData.js";

export default function FormationContext() {
  const { activeWellId } = useWellContext();
  const ctx = getFormationContext(activeWellId);

  if (!ctx) {
    return (
      <section className="wl-card flex flex-col">
        <SectionHeader icon={Layers} title="Formation Context" />
        <div className="flex flex-1 items-center justify-center px-6 py-10 text-[12.5px] text-wl-text-muted">
          No formation context available for this well.
        </div>
      </section>
    );
  }

  return (
    <section className="wl-card flex flex-col">
      <SectionHeader icon={Layers} title="Formation Context" />
      <div className="flex-1 px-5 py-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-wl-text-muted">
              Current Formation
            </div>
            <div className="mt-0.5 text-[22px] font-semibold leading-tight">{ctx.formation}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-wl-text-muted">
              Depth Interval
            </div>
            <div className="tabular mt-0.5 font-mono text-[13px]">
              {ctx.interval[0].toLocaleString("en-IN")} - {ctx.interval[1].toLocaleString("en-IN")} m
            </div>
          </div>
        </div>

        <div className="mt-3 border-t border-wl-border pt-3 text-[11.5px] text-wl-text-secondary">
          <span className="text-wl-text-muted">Lithology: </span>
          {ctx.lithology}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 border-t border-wl-border pt-3.5">
          <MiniStat label="Historical Wells" value={ctx.historicalWells} />
          <MiniStat label="Historical Events" value={ctx.historicalEvents} />
          <MiniStat label="Most Common Event" value={ctx.mostCommonEvent} />
        </div>
      </div>
      <div className="border-t border-wl-border px-5 py-2.5 text-[10px] text-wl-text-muted">
        Counts derived from the representative event dataset.
      </div>
    </section>
  );
}

function MiniStat({ label, value }) {
  return (
    <div>
      <div className="text-[10px] font-medium uppercase tracking-[0.1em] text-wl-text-muted">
        {label}
      </div>
      <div className="mt-0.5 text-[15px] font-semibold">{value}</div>
    </div>
  );
}
