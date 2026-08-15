import { Lightbulb, ArrowRight } from "lucide-react";

import Card from "../common/Card";
import Badge from "../common/Badge";

function RiskDetail({ category }) {
  if (!category) {
    return (
      <Card title="Risk Detail">
        <div className="node-details__empty">
          <Lightbulb size={20} />
          <span>Select a risk category to inspect affected assets, the attack path and the recommended control.</span>
        </div>
      </Card>
    );
  }

  const topRisk = category.topRisk ?? {};

  return (
    <Card title="Risk Detail">
      <div className="risk-detail-section">
        <div className="key-value-list">
          <div className="key-value">
            <span className="key-value__key">Risk</span>
            <span className="key-value__value">{topRisk.name ?? category.name}</span>
          </div>
          <div className="key-value">
            <span className="key-value__key">Severity</span>
            <span className="key-value__value">
              <Badge severity={topRisk.severity?.toLowerCase()}>{topRisk.severity}</Badge>
            </span>
          </div>
          <div className="key-value">
            <span className="key-value__key">Score</span>
            <span className="key-value__value">{topRisk.score ?? category.score}</span>
          </div>
        </div>
      </div>

      <div className="risk-detail-section">
        <span className="sim-result-path__label">Affected Assets</span>
        <div className="flow-chips">
          {topRisk.affectedAssets?.map((asset) => (
            <span className="chip chip--danger" key={asset}>
              {asset}
            </span>
          ))}
        </div>
      </div>

      <div className="risk-detail-section">
        <span className="sim-result-path__label">Attack Path</span>
        <div className="flow-chips">
          {topRisk.attackPath?.split(" → ").map((step, index) => (
            <span className="flow-chips" key={step}>
              {index > 0 && <ArrowRight size={11} className="chip-arrow" aria-hidden="true" />}
              <span className="chip">{step}</span>
            </span>
          ))}
        </div>
        <div className="field-hint">{topRisk.reason}</div>
      </div>

      <div className="risk-detail-section">
        <span className="sim-result-path__label">Recommended Control</span>
        <div className="risk-detail-recommendation">
          <Lightbulb size={14} aria-hidden="true" />
          <span>{topRisk.recommendedControl ?? category.recommendation}</span>
        </div>
      </div>
    </Card>
  );
}

export default RiskDetail;
