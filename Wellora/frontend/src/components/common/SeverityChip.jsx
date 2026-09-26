const SEVERITY_STYLES = {
  High: { color: "#c84435", bg: "#FBEAE8", border: "rgba(200,68,53,0.35)" },
  Medium: { color: "#b97800", bg: "#FBF2E0", border: "rgba(185,120,0,0.35)" },
  Low: { color: "#3f7d55", bg: "#EAF2EC", border: "rgba(63,125,85,0.35)" },
};

export default function SeverityChip({ severity }) {
  const s = SEVERITY_STYLES[severity] ?? {
    color: "#59635f",
    bg: "#F1F3F1",
    border: "rgba(89,99,95,0.35)",
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
