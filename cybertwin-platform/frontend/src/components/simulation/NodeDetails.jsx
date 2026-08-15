import { MousePointerClick } from "lucide-react";

import Card from "../common/Card";
import Badge from "../common/Badge";
import { formatNumber } from "../../utils/format";

const TYPE_INFO = {
  user: "Entry point — the user's credentials are assumed compromised.",
  device: "The user's managed endpoint, carrying the session into the network.",
  network: "Network gateway traversed by the attack.",
  server: "Server host on the attack path.",
  database: "Data storage asset on the attack path.",
  data: "Sensitive records targeted by the attack.",
  storage: "Storage asset on the network.",
};

function NodeDetails({ node }) {
  if (!node) {
    return (
      <Card title="Node Details">
        <div className="node-details__empty">
          <MousePointerClick size={20} />
          <span>Select a node in the graph to inspect its role in the attack.</span>
        </div>
      </Card>
    );
  }

  const status = node.blocked ? "BLOCKED" : node.compromised ? "COMPROMISED" : "UNREACHED";

  return (
    <Card title="Node Details">
      <div className="node-details">
        <div>
          <div className="node-details__name">{node.label}</div>
          <div className="field-hint">{TYPE_INFO[node.type] ?? "Attack graph node."}</div>
        </div>

        <div className="key-value-list">
          <div className="key-value">
            <span className="key-value__key">Type</span>
            <span className="key-value__value">{TYPE_LABELS[node.type]}</span>
          </div>

          <div className="key-value">
            <span className="key-value__key">Criticality</span>
            <span className="key-value__value">
              <Badge severity={node.critical ? "critical" : "low"}>
                {node.critical ? "Critical" : "Standard"}
              </Badge>
            </span>
          </div>

          {node.type === "data" && (
            <div className="key-value">
              <span className="key-value__key">Exposed records</span>
              <span className="key-value__value">{formatNumber(node.records ?? 0)}</span>
            </div>
          )}

          <div className="key-value">
            <span className="key-value__key">Status</span>
            <span className="key-value__value">
              <Badge tone={node.blocked ? "danger" : node.compromised ? "danger" : "neutral"}>
                {status}
              </Badge>
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

const TYPE_LABELS = {
  user: "User",
  device: "Device",
  network: "Network",
  server: "Server",
  database: "Database",
  data: "Sensitive data",
  storage: "Storage",
};

export default NodeDetails;
