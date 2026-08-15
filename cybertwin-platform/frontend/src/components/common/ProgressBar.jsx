function ProgressBar({ value, tone = "info", "aria-label": ariaLabel }) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div
      className="progress-bar"
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel}
    >
      <div
        className={`progress-bar__fill progress-bar__fill--${tone}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export default ProgressBar;
