import { Activity } from "lucide-react";
import SectionHeader from "../common/SectionHeader.jsx";

export default function EventTypeSummary({ totalCounts, activeType, onSelectType }) {
  const max = Math.max(...Object.values(totalCounts), 1);

  return (
    <section className="wl-card flex flex-col">
      <SectionHeader
        icon={Activity}
        title="Event Type Summary"
        actions={
          <span className="text-[10.5px] text-wl-text-muted">
            {Object.values(totalCounts).reduce((s, n) => s + n, 0)} total
          </span>
        }
      />
      <div className="flex-1 space-y-1.5 px-5 py-4">
        {Object.entries(totalCounts)
          .sort((a, b) => b[1] - a[1])
          .map(([type, n]) => (
            <button
              key={type}
              type="button"
              onClick={() => onSelectType(activeType === type ? "all" : type)}
              className={`flex w-full items-center gap-3 rounded-[4px] border px-3 py-1.5 text-left transition-colors duration-100 ${
                activeType === type
                  ? "border-wl-accent-dark bg-wl-accent-light"
                  : "border-transparent hover:bg-wl-surface-2"
              }`}
              title={activeType === type ? "Clear filter" : `Filter by ${type}`}
            >
              <span className="w-[92px] shrink-0 text-[12px] font-medium text-wl-text-primary">{type}</span>
              <span className="h-1.5 flex-1 overflow-hidden rounded-[2px] bg-wl-surface-3">
                <span
                  className="block h-full rounded-[2px] bg-wl-accent"
                  style={{ width: `${(n / max) * 100}%` }}
                />
              </span>
              <span className="tabular w-5 shrink-0 text-right font-mono text-[12px] font-semibold text-wl-text-secondary">
                {n}
              </span>
            </button>
          ))}
      </div>
      <div className="border-t border-wl-border px-4 py-2.5 text-[10px] leading-relaxed text-wl-text-muted">
        Representative prototype data. Click a type to filter the table.
      </div>
    </section>
  );
}
