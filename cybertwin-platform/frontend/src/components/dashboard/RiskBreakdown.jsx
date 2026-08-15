import Card from "../common/Card";
import ProgressBar from "../common/ProgressBar";

/**
 * Horizontal risk bars per category. Expects a subset of the risk
 * categories returned by riskService.getRiskOverview().
 */
function RiskBreakdown({ categories }) {
  if (!categories || categories.length === 0) return null;

  return (
    <Card title="Risk Breakdown">
      <div className="risk-breakdown">
        {categories.map((category) => (
          <div className="risk-breakdown__row" key={category.id}>
            <div className="risk-breakdown__meta">
              <span className="risk-breakdown__name">{category.name}</span>
              <span className="risk-breakdown__score">{category.score}</span>
            </div>
            <ProgressBar
              value={category.score}
              tone={category.severity}
              aria-label={`${category.name} score ${category.score}`}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}

export default RiskBreakdown;
