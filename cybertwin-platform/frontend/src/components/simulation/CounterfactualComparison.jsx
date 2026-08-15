import { useState } from "react";
import { ArrowRight, ArrowLeftRight, Lightbulb } from "lucide-react";

import Card from "../common/Card";
import Badge from "../common/Badge";
import Button from "../common/Button";
import { formatNumber } from "../../utils/format";

const CONTROL_OPTIONS = [
  { id: "mfa", name: "Multi-Factor Authentication (MFA)" },
  { id: "endpointProtection", name: "Endpoint Protection" },
  { id: "networkSegmentation", name: "Network Segmentation" },
  { id: "leastPrivilege", name: "Least Privilege" },
  { id: "passwordPolicy", name: "Password Policy" },
  { id: "vpnAuthentication", name: "VPN Authentication" },
];

function controlLabel(result) {
  return result.mfa || result.control === "mfa" ? "MFA ON" : "MFA OFF";
}

function PathFlow({ path, showBlocked }) {
  return (
    <div className="flow-chips">
      {path.map((node, index) => (
        <span className="flow-chips" key={node.id}>
          {index > 0 && <ArrowRight size={11} className="chip-arrow" aria-hidden="true" />}
          {showBlocked && node.blocked ? (
            <span className="chip chip--blocked">{node.label}</span>
          ) : (
            <span className={`chip ${node.compromised ? "chip--danger" : ""}`}>{node.label}</span>
          )}
        </span>
      ))}
    </div>
  );
}

function MetricsPanel({ result, header, tone, improved }) {
  const rows = [
    { label: "Risk", value: result.risk },
    { label: "Blast Radius", value: `${result.blastRadius}%` },
    { label: "Critical Assets", value: result.criticalAssets },
    { label: "Sensitive Records", value: formatNumber(result.records) },
  ];

  const panelClass = header === "After" ? "cf-panel--after" : "cf-panel--before";

  return (
    <div className={`cf-panel ${panelClass}`}>
      <div className="cf-panel__head">
        <span className="cf-panel__title">{header}</span>
        <Badge tone={tone}>{controlLabel(result)}</Badge>
      </div>

      <div className="cf-metrics">
        {rows.map((row) => (
          <div className="cf-metric" key={row.label}>
            <span className="cf-metric__label">{row.label}</span>
            <span className={`cf-metric__value ${improved ? "is-improved" : ""}`}>
              {row.value}
            </span>
          </div>
        ))}
      </div>

      <div className="cf-panel__path">
        <span className="sim-result-path__label">Attack Path</span>
        <PathFlow path={result.path} showBlocked={header === "After"} />
      </div>
    </div>
  );
}

function CounterfactualComparison({ result, running, onRun, counterfactual }) {
  const [controlId, setControlId] = useState("mfa");

  const after = counterfactual;
  const improved = Boolean(after) && after.risk < result.risk;

  return (
    <Card
      title="Counterfactual Simulation"
      action={
        <div className="card-actions">
          <Badge tone="violet">SIMULATED</Badge>
          <Badge tone="info">Compare</Badge>
        </div>
      }
    >
      <div className="cf-bar">
        <div className="field">
          <label className="field-label" htmlFor="cf-control">
            Apply a security control and re-run the same attack
          </label>
          <select
            id="cf-control"
            className="select"
            value={controlId}
            onChange={(event) => setControlId(event.target.value)}
          >
            {CONTROL_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        <Button
          variant="primary"
          icon={ArrowLeftRight}
          loading={running}
          onClick={() => onRun(controlId)}
        >
          Run Counterfactual
        </Button>
      </div>

      {!after && (
        <div className="state-block">
          <div className="state-block__icon" aria-hidden="true">
            <ArrowLeftRight size={18} />
          </div>
          <div className="state-block__text">
            Re-run the same attack with an alternative control active to measure the
            difference it makes.
          </div>
        </div>
      )}

      {after && (
        <div className="cf-comparison">
          <MetricsPanel result={result} header="Before" tone="neutral" />
          <div className="cf-arrow" aria-hidden="true">
            <ArrowRight size={26} />
          </div>
          <MetricsPanel result={after} header="After" tone="success" improved={improved} />
        </div>
      )}

      {after && improved && (
        <div className="cf-explanation">
          <Lightbulb size={14} aria-hidden="true" />
          <span>
            {after.blockedAt
              ? `Risk decreased because the control blocked the attack at ${after.blockedAt} — the path never reached the critical segment.`
              : "Risk decreased because the control reduced reachability and data exposure along the path."}
          </span>
        </div>
      )}
    </Card>
  );
}

export default CounterfactualComparison;
