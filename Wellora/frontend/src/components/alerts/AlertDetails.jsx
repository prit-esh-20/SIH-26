import { useNavigate } from "react-router-dom";
import { AlertTriangle, FileText, Layers, Users } from "lucide-react";
import SectionHeader from "../common/SectionHeader.jsx";
import { useWellContext } from "../../context/WellContext.jsx";
import {
  getAlertEvidence,
  getComparableEntry,
  getEventsForWell,
} from "../../data/mockData.js";

const SEVERITY_COLOR = {
  High: "#c84435",
  Medium: "#b97800",
  Low: "#3f7d55",
};

export default function AlertDetails({ alert }) {
  const navigate = useNavigate();
  const { setActiveWellId } = useWellContext();

  if (!alert) {
    return (
      <section className="wl-card flex flex-col">
        <SectionHeader icon={AlertTriangle} title="Alert Details" />
        <div className="flex flex-1 items-center justify-center px-6 py-10 text-[12px] text-wl-text-muted">
          Select an alert to view supporting context.
        </div>
      </section>
    );
  }

  const color = SEVERITY_COLOR[alert.severity] ?? "#7b8581";
  const primaryEvent = getAlertEvidence(alert)[0]?.event ?? null;

  return (
    <section className="wl-card flex flex-col">
      <SectionHeader
        icon={AlertTriangle}
        title="Alert Details"
        actions={
          <span className="wl-chip" style={{ color, backgroundColor: `${color}14`, borderColor: `${color}59` }}>
            Active Alert
          </span>
        }
      />

      <div className="px-5 pb-5 pt-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-wl-text-muted">
              Risk
            </div>
            <div className="mt-0.5 text-[19px] font-semibold tracking-wide" style={{ color }}>
              {alert.severity} {alert.riskType} Risk
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

        <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-wl-border pt-3 sm:grid-cols-3">
          <Kv label="Severity" value={alert.severity} />
          <Kv label="Well" value={alert.wellId} />
          <Kv label="Current Depth" value={`${alert.currentDepth.toLocaleString("en-IN")} m`} mono />
          <Kv label="Formation" value={alert.formation} />
          <Kv
            label="Historical Risk Zone"
            value={`${alert.riskInterval[0].toLocaleString("en-IN")} - ${alert.riskInterval[1].toLocaleString("en-IN")} m`}
            mono
          />
          <Kv label="Distance to Zone" value={`${alert.distanceToRiskM} m`} mono />
        </div>

        <div className="mt-3 rounded-[5px] border border-wl-border bg-wl-surface-2 px-3.5 py-3">
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
                  {b.detail && <span className="text-wl-text-secondary"> ({b.detail})</span>}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-3 border-t border-wl-border pt-2.5 text-[11px] leading-relaxed text-wl-text-secondary">
            Representative prototype estimate. Production risk scoring would use authorized operator
            data and validated models.
          </div>
        </div>

        <div className="mt-3.5">
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-wl-text-muted">
            Supporting Evidence
          </div>
          <div className="mt-2 space-y-1.5">
            {alert.comparableWells.map((wellId) => {
              const entry = getComparableEntry(alert.wellId, wellId);
              const wellEvents = entry ? entry.events : getEventsForWell(wellId).length;
              return (
                <button
                  key={wellId}
                  type="button"
                  onClick={() => {
                    setActiveWellId(wellId);
                    navigate("/wells/intelligence");
                  }}
                  className="flex w-full items-center gap-3 rounded-[5px] border border-wl-border bg-wl-surface-2 px-3.5 py-2.5 text-left transition-colors duration-100 hover:border-wl-accent hover:bg-wl-accent-faint"
                  title={`Open ${wellId} in Well Intelligence`}
                >
                  <Users size={13} className="shrink-0 text-wl-text-muted" />
                  <span className="text-[13px] font-semibold text-wl-text-primary">{wellId}</span>
                  <span className="h-3.5 w-px bg-wl-border" />
                  <span className="tabular font-mono text-[11.5px] text-wl-text-secondary">
                    {entry ? `${entry.distanceKm.toFixed(1)} km` : "-"}
                  </span>
                  <span className="tabular font-mono text-[11.5px] text-wl-text-secondary">
                    {entry ? `${entry.similarity}% similarity` : ""}
                  </span>
                  <span className="ml-auto text-[11px] text-wl-text-muted">
                    {wellEvents} historical event{wellEvents === 1 ? "" : "s"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <DepthContext alert={alert} />

        {primaryEvent && <HistoricalResponse event={primaryEvent} />}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="wl-btn wl-btn-primary"
            onClick={() => navigate("/documents")}
          >
            <FileText size={12} />
            View Evidence
          </button>
          <button
            type="button"
            className="wl-btn"
            onClick={() => navigate("/wells/intelligence")}
          >
            <Layers size={12} />
            View Comparable Wells
          </button>
        </div>
      </div>
    </section>
  );
}

function DepthContext({ alert }) {
  const color = SEVERITY_COLOR[alert.severity] ?? "#7b8581";
  const minDepth = alert.currentDepth - 40;
  const maxDepth = alert.riskInterval[1] + 40;
  const span = maxDepth - minDepth || 1;
  const toPct = (d) => ((d - minDepth) / span) * 100;

  return (
    <div className="mt-3.5">
      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-wl-text-muted">
        Depth Context
      </div>
      <div className="mt-2 rounded-[5px] border border-wl-border bg-wl-surface-2 px-3.5 py-3">
        <div className="flex items-center gap-4">
          {/* Vertical depth indicator */}
          <div className="relative h-[130px] w-[186px] shrink-0">
            <div className="relative ml-[118px] h-full w-[3px] rounded-full bg-wl-border">
              <div
                className="absolute left-1/2 w-[34px] -translate-x-1/2 rounded-[2px] border border-dashed"
                style={{
                  top: `${toPct(alert.riskInterval[0])}%`,
                  height: `${Math.max(toPct(alert.riskInterval[1]) - toPct(alert.riskInterval[0]), 2)}%`,
                  borderColor: `${color}80`,
                  backgroundColor: `${color}12`,
                }}
                title={`Historical risk zone ${alert.riskInterval[0].toLocaleString("en-IN")} - ${alert.riskInterval[1].toLocaleString("en-IN")} m`}
              />
              <div
                className="absolute -left-[118px] z-10 w-[118px] whitespace-nowrap rounded-[3px] border border-wl-accent-dark bg-wl-accent-light px-1.5 py-0.5 text-[10px] font-semibold text-wl-text-primary"
                style={{ top: `${toPct(alert.currentDepth)}%`, transform: "translateY(-50%)" }}
              >
                {alert.wellId} · {alert.currentDepth.toLocaleString("en-IN")} m
              </div>
              <div
                className="absolute -left-[4px] z-10 h-[11px] w-[11px] -translate-y-1/2 rounded-full border-2 border-wl-surface bg-wl-accent"
                style={{ top: `${toPct(alert.currentDepth)}%` }}
              />
              <div
                className="absolute left-[24px] flex items-center gap-1 whitespace-nowrap"
                style={{ top: `${toPct(alert.riskInterval[0])}%`, transform: "translateY(-50%)" }}
              >
                <span className="tabular font-mono text-[10px] text-wl-text-secondary">
                  {alert.riskInterval[0].toLocaleString("en-IN")} m
                </span>
                <span className="text-[10px] font-medium" style={{ color }}>
                  zone top
                </span>
              </div>
            </div>
          </div>

          {/* Readouts */}
          <div className="space-y-2.5 border-l border-wl-border pl-4">
            <div>
              <div className="text-[9px] font-semibold uppercase tracking-[0.12em] text-wl-text-muted">
                Current Depth
              </div>
              <div className="tabular mt-0.5 font-mono text-[13px] font-semibold text-wl-text-primary">
                {alert.currentDepth.toLocaleString("en-IN")} m
              </div>
            </div>
            <div>
              <div className="text-[9px] font-semibold uppercase tracking-[0.12em] text-wl-text-muted">
                Distance to Zone
              </div>
              <div className="tabular mt-0.5 font-mono text-[13px] font-semibold" style={{ color }}>
                {alert.distanceToRiskM} m
              </div>
            </div>
            <div>
              <div className="text-[9px] font-semibold uppercase tracking-[0.12em] text-wl-text-muted">
                Historical Risk Zone
              </div>
              <div className="tabular mt-0.5 font-mono text-[13px] font-semibold" style={{ color }}>
                {alert.riskInterval[0].toLocaleString("en-IN")} - {alert.riskInterval[1].toLocaleString("en-IN")} m
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HistoricalResponse({ event }) {
  return (
    <div className="mt-3.5">
      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-wl-text-muted">
        Historical Response
      </div>
      <div className="mt-2 rounded-[5px] border border-wl-border bg-wl-surface-2 px-3.5 py-3">
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          <Kv label="Historical Event" value={event.eventType} />
          <Kv label="Representative Well" value={event.wellId} />
          <Kv label="Event Depth" value={`${event.depth.toLocaleString("en-IN")} m`} mono />
          <Kv label="Severity" value={event.severity} />
          <Kv label="Mitigation Used" value={event.mitigation} />
          <Kv label="NPT" value={`${event.nptHours} hours`} mono />
        </div>
        <div className="mt-2 border-t border-wl-border/70 pt-2 text-[12px] text-wl-text-secondary">
          <span className="font-medium text-wl-text-primary">Operational response: </span>
          {event.operationalResponse}
        </div>
        <div className="mt-1 text-[12px] text-wl-text-secondary">
          <span className="font-medium text-wl-text-primary">Outcome: </span>
          {event.outcome}
        </div>
        <div className="mt-2 border-t border-wl-border pt-2 text-[11px] leading-relaxed text-wl-text-secondary">
          Recorded historical response, not a prescription. Review with the drilling team before acting.
        </div>
      </div>
    </div>
  );
}

function Kv({ label, value, mono = false }) {
  return (
    <div>
      <div className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-wl-text-muted">
        {label}
      </div>
      <div className={`mt-0.5 text-[12.5px] text-wl-text-primary ${mono ? "tabular font-mono" : ""}`}>
        {value}
      </div>
    </div>
  );
}
