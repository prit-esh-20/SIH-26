export default function MetricDisplay({
  label,
  value,
  unit,
  size = "md",
  color,
  mono = false,
}) {
  const valueClass =
    size === "lg"
      ? "text-2xl font-semibold"
      : size === "sm"
        ? "text-sm font-semibold"
        : "text-lg font-semibold";
  return (
    <div className="min-w-0">
      <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-wl-text-muted">
        {label}
      </div>
      <div
        className={`${valueClass} tabular mt-0.5 leading-tight`}
        style={color ? { color } : undefined}
      >
        <span className={mono ? "font-mono" : undefined}>{value}</span>
        {unit && (
          <span className="ml-1 text-xs font-normal text-wl-text-muted">{unit}</span>
        )}
      </div>
    </div>
  );
}
