import { AlertTriangle } from "lucide-react";
import SectionHeader from "../common/SectionHeader.jsx";
import SeverityChip from "../common/SeverityChip.jsx";

const SEVERITY_COLOR = {
  High: "#c84435",
  Medium: "#b97800",
  Low: "#3f7d55",
};

const SEVERITY_SOFT_BG = {
  High: "#FBEAE8",
  Medium: "#FBF2E0",
  Low: "#EAF2EC",
};

export default function AlertsList({ alerts, total, selectedId, onSelect }) {
  return (
    <section className="wl-card flex flex-col">
      <SectionHeader
        icon={AlertTriangle}
        title="Active Alerts"
        actions={
          <span className="text-[10.5px] text-wl-text-muted">
            {alerts.length} of {total} alerts · click a row for context
          </span>
        }
      />
      <div className="flex flex-col gap-2.5 px-3.5 py-3.5">
        {alerts.map((a) => {
          const selected = a.id === selectedId;
          const color = SEVERITY_COLOR[a.severity] ?? "#7b8581";
          const softBg = SEVERITY_SOFT_BG[a.severity] ?? "#F1F3F1";
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => onSelect(a.id)}
              className={`relative rounded-[5px] border px-4 py-3 text-left transition-colors duration-100 ${
                selected
                  ? "border-wl-accent bg-wl-accent-light"
                  : "border-wl-border bg-wl-surface hover:bg-wl-accent-faint"
              }`}
              title={`Select ${a.riskType} alert`}
            >
              {selected && (
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1/2 h-[24px] w-[3px] -translate-y-1/2 rounded-r-full bg-wl-accent"
                />
              )}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <span
                  className="wl-chip"
                  style={{ color, backgroundColor: softBg, borderColor: `${color}59` }}
                >
                  {a.severity}
                </span>
                <span className="text-[13.5px] font-semibold text-wl-text-primary">
                  {a.riskType} Risk
                </span>
                <span
                  className="wl-chip"
                  style={{
                    color: "#59635f",
                    backgroundColor: "#F1F3F1",
                    borderColor: "rgba(89,99,95,0.3)",
                  }}
                >
                  {a.status}
                </span>
                <span className="tabular ml-auto font-mono text-[11px] text-wl-text-muted">
                  {a.id}
                </span>
              </div>

              <div className="mt-2.5 grid grid-cols-2 gap-x-6 gap-y-2 border-t border-wl-border/70 pt-2.5 sm:grid-cols-4">
                <Kv label="Well" value={a.wellId} />
                <Kv label="Current Depth" value={`${a.currentDepth.toLocaleString("en-IN")} m`} mono />
                <Kv label="Formation" value={a.formation} />
                <Kv
                  label="Risk Zone"
                  value={`${a.riskInterval[0].toLocaleString("en-IN")} - ${a.riskInterval[1].toLocaleString("en-IN")} m`}
                  mono
                />
              </div>

              <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-wl-border/70 pt-2.5 text-[11px]">
                <span className="text-wl-text-secondary">
                  Distance to zone:{" "}
                  <span className="tabular font-mono font-medium text-wl-text-primary">
                    {a.distanceToRiskM} m
                  </span>
                </span>
                <span className="text-wl-text-secondary">
                  Comparable wells:{" "}
                  <span className="tabular font-mono font-medium text-wl-text-primary">
                    {a.comparableWells.length}
                  </span>
                </span>
                <span className="text-wl-text-secondary">
                  Historical events:{" "}
                  <span className="tabular font-mono font-medium text-wl-text-primary">
                    {a.historicalEvents}
                  </span>
                </span>
                <span
                  className="tabular ml-auto font-mono text-[12px] font-semibold"
                  style={{ color }}
                >
                  {Math.round(a.riskScore * 100)}% risk
                </span>
              </div>
            </button>
          );
        })}
        {!alerts.length && (
          <div className="px-2 py-10 text-center text-[12px] text-wl-text-muted">
            No alerts match the current filters.
          </div>
        )}
      </div>
      <div className="border-t border-wl-border px-4 py-2.5 text-[10px] leading-relaxed text-wl-text-muted">
        Severity communicates historical proximity, formation and operational similarity. Representative prototype data.
      </div>
    </section>
  );
}

function Kv({ label, value, mono = false }) {
  return (
    <div>
      <div className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-wl-text-muted">
        {label}
      </div>
      <div className={`mt-0.5 text-[12px] text-wl-text-primary ${mono ? "tabular font-mono" : ""}`}>
        {value}
      </div>
    </div>
  );
}
