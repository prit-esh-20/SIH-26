import { ArrowRight, ShieldCheck } from "lucide-react";

import Card from "../common/Card";
import Badge from "../common/Badge";
import { formatNumber } from "../../utils/format";

function PathChip({ node }) {
  if (node.blocked) {
    return <span className="chip chip--blocked">{node.label}</span>;
  }
  if (node.compromised) {
    return <span className="chip chip--danger">{node.label}</span>;
  }
  return <span className="chip chip--accent">{node.label}</span>;
}

function SimulationResult({ result }) {
  const metrics = [
    {
      label: "Risk Score",
      value: result.risk,
      unit: "/ 100",
      foot: <Badge severity={result.severity}>{result.severity.toUpperCase()}</Badge>,
    },
    {
      label: "Blast Radius",
      value: `${result.blastRadius}`,
      unit: "%",
      foot: <Badge tone="neutral">Simulated</Badge>,
    },
    {
      label: "Critical Assets Reached",
      value: result.criticalAssets,
      unit: "",
      foot: <Badge tone={result.criticalAssets > 0 ? "danger" : "success"}>{result.criticalAssets > 0 ? "Exposed" : "None"}</Badge>,
    },
    {
      label: "Sensitive Records Exposed",
      value: formatNumber(result.records),
      unit: "",
      foot: <Badge tone={result.records > 0 ? "danger" : "success"}>{result.records > 0 ? "Exposed" : "None"}</Badge>,
    },
  ];

  return (
    <Card
      title="Simulation Result"
      action={
        <div className="card-actions">
          <Badge tone="violet">SIMULATED</Badge>
          <Badge tone="neutral">{result.id}</Badge>
        </div>
      }
    >
      <div className="sim-result-metrics">
        {metrics.map((metric) => (
          <div className="metric-tile" key={metric.label}>
            <div className="metric-card__top">
              <span className="metric-card__label">{metric.label}</span>
            </div>
            <div className="metric-card__value">
              <span className="metric-card__number">{metric.value}</span>
              {metric.unit && <span className="metric-card__unit">{metric.unit}</span>}
            </div>
            <div className="metric-card__foot">{metric.foot}</div>
          </div>
        ))}
      </div>

      <div className="sim-result-path">
        <span className="sim-result-path__label">Attack Path</span>
        <div className="flow-chips" aria-label="Attack path sequence">
          {result.path.map((node, index) => (
            <span className="flow-chips" key={node.id}>
              {index > 0 && <ArrowRight size={12} className="chip-arrow" aria-hidden="true" />}
              <PathChip node={node} />
            </span>
          ))}
        </div>
      </div>

      <div className="sim-result-note">
        <ShieldCheck size={13} aria-hidden="true" />
        {result.note}
      </div>
    </Card>
  );
}

export default SimulationResult;
