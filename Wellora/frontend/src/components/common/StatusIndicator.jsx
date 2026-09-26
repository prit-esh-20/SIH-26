const STATUS_COLORS = {
  Drilling: "#6fa07a",
  Suspended: "#d99a2b",
  Completed: "#6d94b0",
  "Plug and Abandon": "#8d969b",
};

export function StatusDot({ status, blink = false }) {
  const color = STATUS_COLORS[status] ?? "#8d969b";
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
      style={{ color: STATUS_COLORS[status] ?? "#8d969b" }}
    >
      <StatusDot status={status} blink={blink} />
      {status}
    </span>
  );
}

export default StatusIndicator;
