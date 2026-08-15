import { useNavigate } from "react-router-dom";

function Button({
  children,
  variant = "secondary",
  size,
  icon,
  loading = false,
  disabled = false,
  fullWidth = false,
  to,
  onClick,
  type = "button",
  className = "",
  "aria-label": ariaLabel,
}) {
  const navigate = useNavigate();

  const classes = [
    "btn",
    `btn--${variant}`,
    size && `btn--${size}`,
    fullWidth && "btn--block",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleClick = (event) => {
    if (loading || disabled) return;
    if (to) {
      navigate(to);
      return;
    }
    onClick?.(event);
  };

  const Icon = icon;

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={handleClick}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
    >
      {loading ? <span className="btn-spinner" aria-hidden="true" /> : Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

export default Button;
