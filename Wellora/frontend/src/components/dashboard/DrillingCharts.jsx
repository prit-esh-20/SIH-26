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
  drillingTrendsFallback,
  getWell,
} from "../../data/mockData.js";

const AXIS_STYLE = { fill: "#687177", fontSize: 10 };
const GRID_COLOR = "#22272a";

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[4px] border border-wl-border-strong bg-wl-surface-2 px-2.5 py-2 text-[11px] shadow-[0_8px_20px_rgba(0,0,0,0.45)]">
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
  const isOwnTrend = Boolean(drillingTrends[activeWellId]);
  const data = drillingTrends[activeWellId] ?? drillingTrendsFallback;
  const sectionLabel = isOwnTrend && well ? well.holeSection : "representative profile";

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
      <div className="grid grid-cols-1 gap-4 px-4 py-4 lg:grid-cols-3">
        <MiniLineChart
          data={data}
          dataKey="torque"
          label="Torque"
          unit="kNm"
          color="#c2453c"
          yLabel="kNm"
        />
        <MiniLineChart data={data} dataKey="rop" label="ROP" unit="m/hr" color="#6d94b0" yLabel="m/hr" />
        <MiniLineChart data={data} dataKey="pressure" label="Pressure" unit="psi" color="#6fa07a" yLabel="psi" />
      </div>
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
              axisLine={{ stroke: "#2b3134" }}
              minTickGap={24}
            />
            <YAxis
              tick={AXIS_STYLE}
              tickLine={false}
              axisLine={false}
              width={42}
              domain={["auto", "auto"]}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#3a4145", strokeDasharray: "3 3" }} />
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
