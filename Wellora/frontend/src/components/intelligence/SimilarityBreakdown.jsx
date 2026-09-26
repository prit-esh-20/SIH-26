import { GitCompare } from "lucide-react";
import SectionHeader from "../common/SectionHeader.jsx";
import { getComparableEntry } from "../../data/mockData.js";

const FACTORS = [
  { key: "geographic", label: "Geographic" },
  { key: "geological", label: "Geological" },
  { key: "depth", label: "Depth" },
  { key: "operational", label: "Operational" },
  { key: "event", label: "Historical Event" },
];

export default function SimilarityBreakdown({ selectedWellId }) {
  const entry = getComparableEntry(selectedWellId);
  const breakdown = entry?.similarityBreakdown ?? {};

  return (
    <section className="wl-card flex flex-col">
      <SectionHeader
        icon={GitCompare}
        title="Combined Similarity"
        actions={
          <span className="text-[10.5px] text-wl-text-muted">Representative breakdown</span>
        }
      />
      <div className="flex flex-1 items-center gap-6 px-5 py-4">
        <div className="shrink-0 text-center">
          <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-wl-text-muted">
            Score
          </div>
          <div className="tabular mt-0.5 text-[34px] font-semibold leading-none text-wl-accent-dark">
            {entry?.similarity ?? "-"}
            <span className="text-base font-normal text-wl-text-muted">%</span>
          </div>
        </div>

        <div className="h-16 w-px bg-wl-border" />

        <div className="min-w-0 flex-1 space-y-2">
          {FACTORS.map((f) => (
            <div key={f.key} className="flex items-center gap-2.5">
              <span className="w-[104px] shrink-0 text-[10.5px] font-medium uppercase tracking-[0.08em] text-wl-text-secondary">
                {f.label}
              </span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-[2px] bg-wl-surface-3">
                <div
                  className="h-full rounded-[2px] bg-wl-accent"
                  style={{ width: `${breakdown[f.key] ?? 0}%` }}
                />
              </div>
              <span className="tabular w-9 shrink-0 text-right font-mono text-[11px] text-wl-text-secondary">
                {breakdown[f.key] ?? 0}%
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-wl-border px-4 py-2.5 text-[10px] leading-relaxed text-wl-text-muted">
        Representative prototype values, not live model output.
      </div>
    </section>
  );
}
