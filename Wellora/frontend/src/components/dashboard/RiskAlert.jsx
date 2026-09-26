import { AlertTriangle, ChevronDown, FileText, Layers, Users } from "lucide-react";
import { useState } from "react";
import SectionHeader from "../common/SectionHeader.jsx";
import MetricDisplay from "../common/MetricDisplay.jsx";
import { useWellContext } from "../../context/WellContext.jsx";
import { getRiskAlerts, getAlertEvidence } from "../../data/mockData.js";

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

export default function RiskAlert({ onOpenEvidence, onOpenComparableWells }) {
  const { activeWellId } = useWellContext();
  const alerts = getRiskAlerts(activeWellId);
  const [expanded, setExpanded] = useState(true);

  if (!alerts.length) {
    return (
      <section className="wl-card flex h-full flex-col">
        <SectionHeader icon={AlertTriangle} title="Upcoming Historical Hazard" />
        <div className="flex flex-1 items-center justify-center px-6 py-10 text-center text-[12.5px] text-wl-text-muted">
          No historical hazard identified ahead of the current depth for this well.
        </div>
      </section>
    );
  }

  const alert = alerts[0];
  const color = SEVERITY_COLOR[alert.severity] ?? "#7b8581";
  const evidenceCount = getAlertEvidence(alert).length;

  return (
    <section className="wl-card relative flex flex-col overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[2px]"
        style={{ backgroundColor: color }}
      />
      <SectionHeader
        icon={AlertTriangle}
        title="Upcoming Historical Hazard"
        actions={
          <div className="flex items-center gap-2">
            <span
              className="wl-chip"
              style={{
                color,
                backgroundColor: SEVERITY_SOFT_BG[alert.severity] ?? "#F1F3F1",
                borderColor: `${color}59`,
              }}
            >
              {alert.severity}
            </span>
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="flex h-6 w-6 items-center justify-center rounded-[3px] border border-wl-border text-wl-text-muted transition-colors duration-100 hover:border-wl-border-strong hover:text-wl-text-primary"
              title={expanded ? "Collapse" : "Expand"}
            >
              <ChevronDown
                size={12}
                className={`transition-transform duration-150 ${expanded ? "" : "-rotate-90"}`}
              />
            </button>
          </div>
        }
      />

      <div className="px-6 pb-6 pt-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-wl-text-muted">
              Risk
            </div>
            <div className="mt-0.5 text-[19px] font-semibold tracking-wide" style={{ color }}>
              High {alert.riskType} Risk
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-wl-text-muted">
              Risk Estimate
            </div>
            <div className="tabular mt-0.5 text-[20px] font-semibold leading-none text-wl-text-primary">
              {Math.round(alert.riskScore * 100)}
              <span className="text-sm font-normal text-wl-text-muted">%</span>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-wl-border pt-4 sm:grid-cols-4">
          <MetricDisplay label="Current Depth" value={alert.currentDepth.toLocaleString("en-IN")} unit="m" />
          <MetricDisplay
            label="Historical Risk Zone"
            value={`${alert.riskInterval[0].toLocaleString("en-IN")} - ${alert.riskInterval[1].toLocaleString("en-IN")}`}
            unit="m"
          />
          <MetricDisplay label="Distance" value={alert.distanceToRiskM} unit="m" />
          <MetricDisplay label="Comparable Wells" value={alert.comparableWells.length} />
        </div>

        <div className="mt-4 rounded-[5px] border border-wl-border bg-wl-surface-2 px-3.5 py-3">
          <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-wl-text-muted">
            Why this alert
          </div>
          <ul className="mt-2 space-y-1.5">
            {alert.basis.map((b) => (
              <li key={b.label} className="flex items-start gap-2 text-[12px]">
                <span
                  className="mt-[4px] inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: b.present ? color : "#b3bab6" }}
                />
                <span className="text-wl-text-primary">
                  {b.label}
                  {b.detail && (
                    <span className="text-wl-text-secondary"> ({b.detail})</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-3 border-t border-wl-border pt-2.5 text-[11px] leading-relaxed text-wl-text-secondary">
            Supported by {evidenceCount} historical event{evidenceCount === 1 ? "" : "s"} and{" "}
            {alert.comparableWells.length} comparable well{alert.comparableWells.length === 1 ? "" : "s"}.
            Review with the drilling team before acting.
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button type="button" className="wl-btn wl-btn-primary" onClick={() => onOpenEvidence(alert)}>
            <FileText size={12} />
            View Evidence
          </button>
          <button type="button" className="wl-btn" onClick={onOpenComparableWells}>
            <Layers size={12} />
            View Comparable Wells
          </button>
          <span className="ml-auto flex items-center gap-1.5 text-[10.5px] text-wl-text-muted">
            <Users size={11} />
            Nearest event: {alert.evidence[0]?.wellId} at {alert.evidence[0]?.depth.toLocaleString("en-IN")} m
          </span>
        </div>
      </div>
    </section>
  );
}
