const TONE_CLASSES = {
  success: "status-indicator--success",
  warning: "status-indicator--warning",
  danger: "status-indicator--danger",
  info: "status-indicator--info",
  neutral: "status-indicator--neutral",
};

function StatusIndicator({ tone = "neutral", label, pulse = false, "aria-label": ariaLabel }) {
  return (
    <span
      className={`status-indicator ${TONE_CLASSES[tone]}`}
      role="status"
      aria-label={ariaLabel ?? label}
    >
      <span className={`status-dot ${pulse ? "pulse-soft" : ""}`} aria-hidden="true" />
      <span className="status-text">{label}</span>
    </span>
  );
}

export default StatusIndicator;
