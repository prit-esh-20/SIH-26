import Card from "../common/Card";

function MetricCard({ label, value, unit = "", status, statusTone = "neutral", icon: Icon }) {
  return (
    <Card className="metric-card">
      <div className="metric-card__top">
        <span className="metric-card__label">{label}</span>
        {Icon && (
          <span className="metric-card__icon" aria-hidden="true">
            <Icon size={16} />
          </span>
        )}
      </div>

      <div className="metric-card__value">
        <span className="metric-card__number">{value}</span>
        {unit && <span className="metric-card__unit">{unit}</span>}
      </div>

      <div className="metric-card__foot">
        <span className={`badge badge--${statusTone}`}>{status}</span>
      </div>
    </Card>
  );
}

export default MetricCard;
