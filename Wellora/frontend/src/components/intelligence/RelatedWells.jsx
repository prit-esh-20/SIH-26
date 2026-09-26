import { Users } from "lucide-react";
import SectionHeader from "../common/SectionHeader.jsx";
import { useWellContext } from "../../context/WellContext.jsx";
import { getComparableWells } from "../../data/mockData.js";

export default function RelatedWells({ selectedWellId, onSelect }) {
  const { activeWellId } = useWellContext();
  const others = getComparableWells(activeWellId).filter((c) => c.wellId !== selectedWellId);

  return (
    <section className="wl-card flex flex-col">
      <SectionHeader icon={Users} title="Other Comparable Wells" />
      <div className="flex flex-1 flex-wrap gap-2 px-4 py-4">
        {others.map((c) => (
          <button
            key={c.wellId}
            type="button"
            onClick={() => onSelect(c.wellId)}
            className="flex items-center gap-2.5 rounded-[5px] border border-wl-border bg-wl-surface-2 px-3 py-2 text-left transition-colors duration-100 hover:border-wl-accent hover:bg-wl-accent-faint"
            title={`Select ${c.wellId}`}
          >
            <span className="text-[12.5px] font-semibold text-wl-text-primary">{c.wellId}</span>
            <span className="h-3 w-px bg-wl-border" />
            <span className="tabular font-mono text-[11.5px] text-wl-text-secondary">
              {c.similarity}%
            </span>
            <span className="text-[10.5px] text-wl-text-muted">
              {c.events} event{c.events === 1 ? "" : "s"}
            </span>
          </button>
        ))}
        {!others.length && (
          <div className="px-1 py-2 text-[12px] text-wl-text-muted">
            No other comparable wells.
          </div>
        )}
      </div>
    </section>
  );
}
