import { Layers } from "lucide-react";
import SectionHeader from "../common/SectionHeader.jsx";
import { useWellContext } from "../../context/WellContext.jsx";
import { comparableWells, formations, getWell, historicalEvents } from "../../data/mockData.js";

export default function FormationContext() {
  const { activeWellId } = useWellContext();
  const well = getWell(activeWellId);
  const f = formations[well?.formation] ?? null;

  const eventsInFormation = f
    ? historicalEvents.filter((e) => e.formation === well.formation).length
    : 0;
  const wellsInFormation = f
    ? new Set(
        historicalEvents
          .filter((e) => e.formation === well.formation)
          .map((e) => e.wellId)
      ).size
    : 0;

  return (
    <section className="wl-card flex flex-col">
      <SectionHeader icon={Layers} title="Formation Context" />
      <div className="flex-1 px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-wl-text-muted">
              Current Formation
            </div>
            <div className="mt-0.5 text-[22px] font-semibold leading-tight">{well?.formation}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-wl-text-muted">
              Depth Interval
            </div>
            <div className="tabular mt-0.5 font-mono text-[13px]">
              {f ? `${f.interval[0].toLocaleString("en-IN")} - ${f.interval[1].toLocaleString("en-IN")} m` : "-"}
            </div>
          </div>
        </div>

        <div className="mt-3 border-t border-wl-border pt-3 text-[11.5px] text-wl-text-secondary">
          <span className="text-wl-text-muted">Lithology: </span>
          {f?.lithology ?? "Not defined"}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 border-t border-wl-border pt-3.5">
          <MiniStat label="Historical Wells" value={wellsInFormation} />
          <MiniStat label="Historical Events" value={eventsInFormation} />
          <MiniStat label="Most Common Event" value={mostCommonEvent(eventsInFormation ? well.formation : null)} />
        </div>
      </div>
      <div className="border-t border-wl-border px-4 py-2.5 text-[10px] text-wl-text-muted">
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

function mostCommonEvent(formation) {
  if (!formation) return "-";
  const counts = {};
  for (const e of historicalEvents) {
    if (e.formation !== formation) continue;
    counts[e.eventType] = (counts[e.eventType] ?? 0) + 1;
  }
  const best = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return best ? best[0] : "-";
}
