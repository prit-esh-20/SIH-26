import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp, AlertCircle, CheckCircle, XCircle, Info } from "lucide-react";
import SectionHeader from "../common/SectionHeader.jsx";
import { useWellContext } from "../../context/WellContext.jsx";
import {
  drillingTrends,
  getWell,
  getEventsForWell,
  getComparableWells,
  historicalEvents,
  getTotalNptForWell,
  getFormationContext,
} from "../../data/mockData.js";

function getStatusIcon(status) {
  switch (status) {
    case "Drilling":
      return TrendingUp;
    case "Suspended":
      return AlertCircle;
    case "Completed":
      return CheckCircle;
    case "Plug and Abandon":
      return XCircle;
    default:
      return Info;
  }
}

function getStatusColor(status) {
  switch (status) {
    case "Drilling":
      return "#E8751A";
    case "Suspended":
      return "#B97800";
    case "Completed":
      return "#3F7D55";
    case "Plug and Abandon":
      return "#C84435";
    default:
      return "#69736F";
  }
}

export default function DrillingCharts() {
  const { activeWellId } = useWellContext();
  const well = getWell(activeWellId);
  const hasOwnTrend = Boolean(drillingTrends[activeWellId]);
  const data = hasOwnTrend ? drillingTrends[activeWellId] : null;

  if (!well) return null;

  const status = well.status;
  const StatusIcon = getStatusIcon(status);
  const statusColor = getStatusColor(status);

  // Drilling wells with trend data - show existing charts
  if (data && status === "Drilling") {
    return (
      <section className="wl-card flex flex-col">
        <SectionHeader
          icon={TrendingUp}
          title="Drilling Trends, Depth Indexed"
          actions={
            <span className="text-[10.5px] text-wl-text-muted">
              {activeWellId} · {well.holeSection}
            </span>
          }
        />
        <div className="grid grid-cols-1 gap-4 px-4 py-4 lg:grid-cols-3">
          <MiniLineChart
            data={data}
            dataKey="torque"
            label="Torque"
            unit="kNm"
            color="#E8751A"
            yLabel="kNm"
          />
          <MiniLineChart data={data} dataKey="rop" label="ROP" unit="m/hr" color="#5B7687" yLabel="m/hr" />
          <MiniLineChart data={data} dataKey="pressure" label="Pressure" unit="psi" color="#3F7D55" yLabel="psi" />
        </div>
      </section>
    );
  }

  // For non-drilling wells, show status-appropriate summary
  const events = getEventsForWell(activeWellId);
  const comps = getComparableWells(activeWellId);
  const npt = getTotalNptForWell(activeWellId);
  const formationCtx = getFormationContext(activeWellId);

  // Event counts by type
  const eventCounts = {};
  for (const e of events) {
    eventCounts[e.eventType] = (eventCounts[e.eventType] ?? 0) + 1;
  }
  const mostCommonEvent = Object.entries(eventCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "-";

  // Find nearest historical event to current depth
  let nearestEvent = null;
  let minDist = Infinity;
  for (const e of events) {
    const dist = Math.abs(e.depth - well.depth);
    if (dist < minDist) {
      minDist = dist;
      nearestEvent = e;
    }
  }

  // Count unique comparable wells with events
  const comparableWellIds = new Set(comps.map((c) => c.wellId));
  const comparableWithEvents = [...comparableWellIds].filter((id) => getEventsForWell(id).length > 0).length;

  return (
    <section className="wl-card flex flex-col">
      <SectionHeader
        icon={StatusIcon}
        title={status === "Suspended" ? "Well Outcome & Suspension Summary" : status === "Completed" ? "Well Completion Summary" : "Well Closure Summary"}
        actions={
          <span
            className="wl-chip"
            style={{
              color: statusColor,
              backgroundColor: `${statusColor}14`,
              borderColor: `${statusColor}59`,
            }}
          >
            {status}
          </span>
        }
      />

      <div className="px-4 py-4 space-y-4">
        {/* Status Header Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11.5px]">
          <StatItem label="Status" value={status} valueColor={statusColor} />
          <StatItem label="Current Depth" value={`${well.depth.toLocaleString("en-IN")} m`} mono />
          <StatItem label="Formation" value={well.formation} />
          <StatItem label="Hole Section" value={well.holeSection} />
        </div>

        {/* Status-specific details */}
        {status === "Suspended" && well.suspensionDate && (
          <div className="rounded-[5px] border border-wl-border bg-wl-surface-2 p-3 space-y-2">
            <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-wl-text-secondary">
              Suspension Details
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11.5px]">
              <StatItem label="Suspended At" value={`${well.depth.toLocaleString("en-IN")} m`} mono />
              <StatItem label="Suspension Date" value={well.suspensionDate} />
              {well.suspensionCategory && <StatItem label="Category" value={well.suspensionCategory} colSpan={2} />}
            </div>
            {well.suspensionReason && (
              <div className="border-t border-wl-border pt-2">
                <div className="text-[10px] font-medium text-wl-text-muted">Primary Reason</div>
                <div className="mt-0.5 text-[11.5px] text-wl-text-primary">{well.suspensionReason}</div>
              </div>
            )}
            {well.suspensionSummary && (
              <div className="border-t border-wl-border pt-2">
                <div className="text-[10px] font-medium text-wl-text-muted">Operational Summary</div>
                <div className="mt-0.5 text-[11.5px] text-wl-text-secondary">{well.suspensionSummary}</div>
              </div>
            )}
            {well.suspensionEvidence && (
              <div className="border-t border-wl-border pt-2">
                <div className="text-[10px] font-medium text-wl-text-muted">Evidence</div>
                <div className="mt-0.5 text-[10.5px] font-mono text-wl-text-muted">{well.suspensionEvidence}</div>
              </div>
            )}
          </div>
        )}

        {status === "Completed" && well.completionDate && (
          <div className="rounded-[5px] border border-wl-border bg-wl-surface-2 p-3 space-y-2">
            <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-wl-text-secondary">
              Completion Details
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11.5px]">
              <StatItem label="Completed At" value={`${well.depth.toLocaleString("en-IN")} m`} mono />
              <StatItem label="Completion Date" value={well.completionDate} />
              <StatItem label="Completion Type" value={well.completionType} />
              <StatItem label="Total NPT" value={`${well.totalNpt?.toFixed(1) ?? npt.toFixed(1)} h`} mono />
            </div>
            {well.completionSummary && (
              <div className="border-t border-wl-border pt-2">
                <div className="text-[10px] font-medium text-wl-text-muted">Summary</div>
                <div className="mt-0.5 text-[11.5px] text-wl-text-secondary">{well.completionSummary}</div>
              </div>
            )}
            {well.significantEvents && well.significantEvents.length > 0 && (
              <div className="border-t border-wl-border pt-2">
                <div className="text-[10px] font-medium text-wl-text-muted">Significant Events</div>
                <div className="mt-1.5 space-y-1">
                  {well.significantEvents.map((se, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[11px] text-wl-text-secondary">
                      <span className="w-[2px] h-3 rounded-full" style={{ backgroundColor: SEVERITY_COLOR[se.severity] }} />
                      <span className="tabular font-mono">{se.depth.toLocaleString("en-IN")} m</span>
                      <span>{se.eventType}</span>
                      <span className="text-wl-text-muted">({se.severity})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {status === "Plug and Abandon" && well.paDate && (
          <div className="rounded-[5px] border border-wl-border bg-wl-surface-2 p-3 space-y-2">
            <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-wl-text-secondary">
              Closure Details
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11.5px]">
              <StatItem label="P&A At" value={`${well.depth.toLocaleString("en-IN")} m`} mono />
              <StatItem label="P&A Date" value={well.paDate} />
            </div>
            {well.paReason && (
              <div className="border-t border-wl-border pt-2">
                <div className="text-[10px] font-medium text-wl-text-muted">Closure Reason</div>
                <div className="mt-0.5 text-[11.5px] text-wl-text-primary">{well.paReason}</div>
              </div>
            )}
            {well.paSummary && (
              <div className="border-t border-wl-border pt-2">
                <div className="text-[10px] font-medium text-wl-text-muted">Summary</div>
                <div className="mt-0.5 text-[11.5px] text-wl-text-secondary">{well.paSummary}</div>
              </div>
            )}
            {well.paEvidence && (
              <div className="border-t border-wl-border pt-2">
                <div className="text-[10px] font-medium text-wl-text-muted">Evidence</div>
                <div className="mt-0.5 text-[10.5px] font-mono text-wl-text-muted">{well.paEvidence}</div>
              </div>
            )}
            {well.majorEvents && well.majorEvents.length > 0 && (
              <div className="border-t border-wl-border pt-2">
                <div className="text-[10px] font-medium text-wl-text-muted">Major Historical Events</div>
                <div className="mt-1.5 space-y-1">
                  {well.majorEvents.map((se, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[11px] text-wl-text-secondary">
                      <span className="w-[2px] h-3 rounded-full" style={{ backgroundColor: SEVERITY_COLOR[se.severity] }} />
                      <span className="tabular font-mono">{se.depth.toLocaleString("en-IN")} m</span>
                      <span>{se.eventType}</span>
                      <span className="text-wl-text-muted">({se.severity})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Statistics Row - always shown */}
        <div className="rounded-[5px] border border-wl-border bg-wl-surface-2 p-3">
          <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-wl-text-secondary mb-2">
            Well Statistics
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-[11px]">
            <StatItem label="Historical Events" value={String(events.length)} mono />
            <StatItem label="Comparable Wells" value={String(comparableWithEvents)} mono />
            <StatItem label="Nearest Event" value={nearestEvent ? `${minDist} m` : "—"} mono />
            <StatItem label="Most Common Event" value={mostCommonEvent} />
            <StatItem label="Formation" value={well.formation} />
            <StatItem label="Total NPT" value={`${npt.toFixed(1)} h`} mono />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatItem({ label, value, mono = false, valueColor, colSpan = 1 }) {
  return (
    <div className={`col-span-${colSpan}`}>
      <div className="text-[9.5px] font-medium uppercase tracking-[0.1em] text-wl-text-muted">
        {label}
      </div>
      <div className={`mt-0.5 text-[12px] font-medium text-wl-text-primary ${mono ? "tabular font-mono" : ""}`} style={{ color: valueColor }}>
        {value}
      </div>
    </div>
  );
}

const SEVERITY_COLOR = {
  High: "#c84435",
  Medium: "#b97800",
  Low: "#3f7d55",
};

function MiniLineChart({ data, dataKey, label, unit, color }) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-wl-text-secondary">
          {label}
        </span>
        <span className="text-[10px] text-wl-text-muted">{unit} vs depth</span>
      </div>
      <div className="h-[130px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 6, bottom: 0, left: -18 }}>
            <CartesianGrid stroke={GRID_COLOR} strokeDasharray="2 4" vertical={false} />
            <XAxis
              dataKey="depth"
              tick={AXIS_STYLE}
              tickLine={false}
              axisLine={{ stroke: "#C8CECA" }}
              minTickGap={24}
            />
            <YAxis
              tick={AXIS_STYLE}
              tickLine={false}
              axisLine={false}
              width={42}
              domain={["auto", "auto"]}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#B3BAB6", strokeDasharray: "3 3" }} />
            <Line
              type="monotone"
              dataKey={dataKey}
              name={label}
              stroke={color}
              strokeWidth={1.6}
              dot={false}
              activeDot={{ r: 2.5, strokeWidth: 0 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const AXIS_STYLE = { fill: "#69736F", fontSize: 10 };
const GRID_COLOR = "#E5E8E6";

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[4px] border border-wl-border bg-wl-surface px-2.5 py-2 text-[11px] shadow-[0_8px_20px_rgba(23,32,29,0.14)]">
      <div className="tabular font-mono text-wl-text-muted">Depth {label} m</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="tabular mt-0.5 flex items-center gap-2 font-mono">
          <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: p.stroke }} />
          <span className="text-wl-text-secondary">{p.name}</span>
          <span className="ml-auto text-wl-text-primary">{p.value}</span>
        </div>
      ))}
    </div>
  );
}