const SEVERITY_STYLES = {
  High: { color: "#cf5f52", bg: "rgba(207,95,82,0.12)", border: "rgba(207,95,82,0.45)" },
  Medium: { color: "#d99a2b", bg: "rgba(217,154,43,0.12)", border: "rgba(217,154,43,0.45)" },
  Low: { color: "#6fa07a", bg: "rgba(111,160,122,0.12)", border: "rgba(111,160,122,0.45)" },
};

export default function SeverityChip({ severity }) {
  const s = SEVERITY_STYLES[severity] ?? {
    color: "#8d969b",
    bg: "rgba(141,150,155,0.1)",
    border: "rgba(141,150,155,0.4)",
  };
  return (
    <span
      className="wl-chip"
      style={{ color: s.color, backgroundColor: s.bg, borderColor: s.border }}
    >
      {severity}
    </span>
  );
}
