import Card from "../common/Card";
import Badge from "../common/Badge";

function SimulationHistory({ entries, onSelect, activeId }) {
  return (
    <Card title="Simulation History" action={<Badge tone="neutral">{entries.length} runs</Badge>}>
      {entries.length === 0 ? (
        <div className="state-block__text" style={{ padding: "8px 0" }}>
          No simulations in this session yet.
        </div>
      ) : (
        <div className="sim-history-list">
          {entries.map((entry) => (
            <button
              type="button"
              key={entry.id}
              className="sim-history-item"
              onClick={() => onSelect?.(entry)}
              aria-label={`View ${entry.scenarioName} simulation ${entry.id}`}
            >
              <div className="sim-history-item__top">
                <span className="sim-history-item__name">{entry.scenarioName}</span>
                <Badge severity={entry.severity}>{entry.risk}</Badge>
              </div>
              <div className="sim-history-item__meta">
                {entry.id} · {entry.userName} · MFA {entry.mfa ? "ON" : "OFF"}
                {activeId === entry.id ? " · viewing" : ""}
              </div>
            </button>
          ))}
        </div>
      )}
    </Card>
  );
}

export default SimulationHistory;
