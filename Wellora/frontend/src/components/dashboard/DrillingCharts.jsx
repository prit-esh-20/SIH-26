import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp } from "lucide-react";
import SectionHeader from "../common/SectionHeader.jsx";
import { useWellContext } from "../../context/WellContext.jsx";
import {
  drillingTrends,
  getWell,
} from "../../data/mockData.js";

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

export default function DrillingCharts() {
  const { activeWellId } = useWellContext();
  const well = getWell(activeWellId);
  const hasOwnTrend = Boolean(drillingTrends[activeWellId]);
  const data = hasOwnTrend ? drillingTrends[activeWellId] : null;
  const sectionLabel = hasOwnTrend && well ? well.holeSection : "no trend data for this well";

  return (
    <section className="wl-card flex flex-col">
      <SectionHeader
        icon={TrendingUp}
        title="Drilling Trends, Depth Indexed"
        actions={
          <span className="text-[10.5px] text-wl-text-muted">
            {activeWellId} · {sectionLabel}
          </span>
        }
      />
      {data ? (
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
      ) : (
        <div className="flex-1 flex items-center justify-center px-4 py-8 text-center text-[12.5px] text-wl-text-muted">
          No representative drilling trend data available for {activeWellId}.
        </div>
      )}
    </section>
  );
}

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
