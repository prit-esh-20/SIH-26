const SEVERITY_TONES = {
  low: "low",
  medium: "medium",
  high: "high",
  critical: "critical",
};

function Badge({ children, tone = "neutral", severity, className = "" }) {
  const resolved = severity ? SEVERITY_TONES[severity] ?? "neutral" : tone;

  return (
    <span className={`badge badge--${resolved} ${className}`}>
      {children}
    </span>
  );
}

export default Badge;
