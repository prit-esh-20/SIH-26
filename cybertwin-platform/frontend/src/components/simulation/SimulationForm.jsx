import { useState } from "react";
import { PlayCircle, Sparkles } from "lucide-react";

import Card from "../common/Card";
import Button from "../common/Button";
import Switch from "../common/Switch";

const DEFAULT_CONTROLS = [
  { id: "none", name: "None" },
  { id: "mfa", name: "Multi-Factor Authentication (MFA)" },
  { id: "endpointProtection", name: "Endpoint Protection" },
  { id: "networkSegmentation", name: "Network Segmentation" },
  { id: "leastPrivilege", name: "Least Privilege" },
  { id: "passwordPolicy", name: "Password Policy" },
  { id: "vpnAuthentication", name: "VPN Authentication" },
];

function SimulationForm({ scenarios, users, running, onRun }) {
  const [scenarioId, setScenarioId] = useState("");
  const [userId, setUserId] = useState("");
  const [mfa, setMfa] = useState(false);
  const [control, setControl] = useState("none");
  const [loadedData, setLoadedData] = useState({ scenarios: null, users: null });

  // Adjust selections once the async option lists arrive (render-phase sync).
  if (loadedData.scenarios !== scenarios || loadedData.users !== users) {
    setLoadedData({ scenarios, users });
    if (!scenarioId && scenarios?.length) {
      setScenarioId(scenarios[0].id);
      setUserId(scenarios[0].primaryUser);
    } else if (!userId && users?.length) {
      setUserId(users[0].id);
    }
  }

  const scenario = scenarios?.find((s) => s.id === scenarioId);

  const handleScenarioChange = (id) => {
    setScenarioId(id);
    const next = scenarios?.find((s) => s.id === id);
    if (next) setUserId(next.primaryUser);
  };

  const handleRun = () => {
    onRun({ scenarioId, userId, mfa, control });
  };

  const recommended = scenario?.recommendedControl;
  const showRecommendation =
    recommended && ((recommended === "mfa" && !mfa) || (recommended !== "mfa" && control === "none"));

  return (
    <Card title="Simulation Configuration">
      <div className="sim-form">
        <div className="field">
          <label className="field-label" htmlFor="scenario-select">
            Scenario
          </label>
          <select
            id="scenario-select"
            className="select"
            value={scenarioId}
            onChange={(event) => handleScenarioChange(event.target.value)}
          >
            {scenarios?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          {scenario && <p className="sim-scenario-description">{scenario.description}</p>}
        </div>

        <div className="field">
          <label className="field-label" htmlFor="user-select">
            Compromised User
          </label>
          <select
            id="user-select"
            className="select"
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
          >
            {users?.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} — {user.role}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="field-label" htmlFor="mfa-switch">
            Multi-Factor Authentication
          </label>
          <div className="field-row">
            <div>
              <div className="field-label--plain">MFA at network entry</div>
              <div className="field-hint">Current state: {mfa ? "ON" : "OFF"}</div>
            </div>
            <Switch checked={mfa} onChange={setMfa} label="MFA at network entry" />
          </div>
        </div>

        <div className="field">
          <label className="field-label" htmlFor="control-select">
            Additional Control
          </label>
          <select
            id="control-select"
            className="select"
            value={control}
            onChange={(event) => setControl(event.target.value)}
          >
            {DEFAULT_CONTROLS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {showRecommendation && (
          <div className="sim-recommendation">
            <Sparkles size={13} aria-hidden="true" />
            <span>
              Recommended: enable{" "}
              <strong>
                {recommended === "mfa"
                  ? "MFA"
                  : DEFAULT_CONTROLS.find((c) => c.id === recommended)?.name}
              </strong>{" "}
              to reduce this scenario's risk.
            </span>
          </div>
        )}

        <Button
          variant="primary"
          size="lg"
          fullWidth
          icon={PlayCircle}
          loading={running}
          disabled={!scenarioId || !userId}
          onClick={handleRun}
        >
          {running ? "Simulating..." : "Simulate Attack"}
        </Button>

        <div className="field-hint">
          Deterministic demonstration values until the backend is connected.
        </div>
      </div>
    </Card>
  );
}

export default SimulationForm;
