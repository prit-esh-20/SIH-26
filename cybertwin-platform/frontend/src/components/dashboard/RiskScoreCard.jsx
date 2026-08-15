import Card from "../common/Card";

const SEVERITY_COLORS = {
  low: "#16803C",
  medium: "#B54708",
  high: "#E65F00",
  critical: "#B42318",
};

function RiskScoreCard({ score, severity, note }) {
  const radius = 84;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, score));
  const dash = (clamped / 100) * circumference;
  const color = SEVERITY_COLORS[severity] ?? "#155EEF";

  return (
    <Card
      title="Overall Risk Score"
      action={<span className={`badge badge--${severity}`}>{severity.toUpperCase()}</span>}
    >
      <div className="risk-gauge">
        <svg
          className="risk-gauge__svg"
          viewBox="0 0 200 200"
          role="img"
          aria-label={`Overall risk score ${clamped} out of 100, severity ${severity}`}
        >
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="var(--bg-elevated)"
            strokeWidth="14"
          />
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
            transform="rotate(-90 100 100)"
            style={{ transition: "stroke-dasharray 0.6s ease" }}
          />
          <text
            x="100"
            y="96"
            textAnchor="middle"
            fill="var(--text-primary)"
            fontSize="40"
            fontWeight="700"
          >
            {clamped}
          </text>
          <text x="100" y="120" textAnchor="middle" fill="var(--text-muted)" fontSize="12">
            / 100
          </text>
        </svg>

        <div className="risk-gauge__foot">
          <span className="risk-gauge__note">
            {note ??
              "Derived from the digital twin's simulated posture and enabled security controls."}
          </span>
        </div>
      </div>
    </Card>
  );
}

export default RiskScoreCard;
