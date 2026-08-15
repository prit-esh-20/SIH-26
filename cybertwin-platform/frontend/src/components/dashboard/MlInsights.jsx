import { BrainCircuit } from "lucide-react";

import Card from "../common/Card";
import Badge from "../common/Badge";
import ProgressBar from "../common/ProgressBar";

/**
 * ML-assisted behavioral risk preview.
 * Clearly labelled as a prediction — never confused with deterministic simulation.
 */
function MlInsights({ users }) {
  if (!users || users.length === 0) return null;
  const [top, ...rest] = users;

  return (
    <Card
      title={
        <span className="teaser-card__title">
          <BrainCircuit size={15} />
          Behavioral Risk — ML
        </span>
      }
      action={<Badge tone="violet">ML-assisted</Badge>}
    >
      <div className="teaser-card">
        <div>
          <div className="risk-breakdown__meta">
            <span className="risk-breakdown__name">{top.user}</span>
            <span className="risk-breakdown__score">{top.score}</span>
          </div>
          <div className="ml-score-row">
            <ProgressBar
              value={top.score}
              tone={top.level.toLowerCase()}
              aria-label={`${top.user} ML risk score ${top.score}`}
            />
            <Badge tone={top.level.toLowerCase()}>{top.level}</Badge>
          </div>
          <div className="field-hint ml-confidence">
            Confidence {top.confidence.toFixed(2)} · prediction, not measurement
          </div>
        </div>

        <div>
          {top.signals.map((signal) => (
            <div className="ml-signal" key={signal}>
              {signal}
            </div>
          ))}
        </div>

        {rest.length > 0 && (
          <div className="field-hint">
            {rest.length} more flagged users — see Risk Analysis
          </div>
        )}
      </div>
    </Card>
  );
}

export default MlInsights;
