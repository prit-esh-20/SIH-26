const STATUS_COLORS = {
  Drilling: "#3f7d55",
  Suspended: "#b97800",
  Completed: "#5b7687",
  "Plug and Abandon": "#7b8581",
};

export function StatusDot({ status, blink = false }) {
  const color = STATUS_COLORS[status] ?? "#7b8581";
  return (
    <span
      className={`inline-block h-2 w-2 rounded-full ${blink ? "wl-blink" : ""}`}
      style={{ backgroundColor: color }}
    />
  );
}

export function StatusIndicator({ status, blink = false, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] ${className}`}
      style={{ color: STATUS_COLORS[status] ?? "#7b8581" }}
    >
      <StatusDot status={status} blink={blink} />
      {status}
    </span>
  );
}

export default StatusIndicator;
