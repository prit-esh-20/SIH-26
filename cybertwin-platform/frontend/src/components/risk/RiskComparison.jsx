import Card from "../common/Card";
import Badge from "../common/Badge";
import ProgressBar from "../common/ProgressBar";

import { useTwin } from "../../hooks/useTwin";
import { getControls, computeOverallRisk } from "../../utils/twinStore";

/**
 * Compares the organization's posture across three control states:
 * no controls → current controls → all controls.
 */
function RiskComparison() {
  useTwin();
  const current = getControls();

  const allDisabled = Object.fromEntries(Object.keys(current).map((id) => [id, false]));
  const allEnabled = Object.fromEntries(Object.keys(current).map((id) => [id, true]));

  const rows = [
    {
      label: "Without controls",
      note: "All modeled controls disabled",
      score: computeOverallRisk(allDisabled),
      tone: "critical",
    },
    {
      label: "Current posture",
      note: "Your enabled controls",
      score: computeOverallRisk(current),
      tone: "info",
    },
    {
      label: "With all controls",
      note: "Every modeled control enabled",
      score: computeOverallRisk(allEnabled),
      tone: "success",
    },
  ];

  return (
    <Card title="Control Impact" action={<Badge tone="info">Comparison</Badge>}>
      <div className="control-impact">
        {rows.map((row) => (
          <div className="control-impact__row" key={row.label}>
            <div className="risk-breakdown__meta">
              <div>
                <div className="risk-breakdown__name">{row.label}</div>
                <div className="field-hint">{row.note}</div>
              </div>
              <div className="risk-breakdown__score">
                {row.score}
                <span className="field-hint"> / 100</span>
              </div>
            </div>
            <ProgressBar
              value={row.score}
              tone={row.tone}
              aria-label={`${row.label} risk score ${row.score}`}
            />
          </div>
        ))}

        <div className="field-hint">
          Scores are computed deterministically from the modeled controls in the digital
          twin.
        </div>
      </div>
    </Card>
  );
}

export default RiskComparison;
