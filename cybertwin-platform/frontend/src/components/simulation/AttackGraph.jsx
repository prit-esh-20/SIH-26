import { useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import {
  CircleDot,
  Database,
  FileLock,
  HardDrive,
  Laptop,
  Network,
  Server,
  User,
} from "lucide-react";

const NODE_ICONS = {
  user: User,
  device: Laptop,
  network: Network,
  server: Server,
  database: Database,
  data: FileLock,
  storage: HardDrive,
};

const TYPE_LABELS = {
  user: "User",
  device: "Device",
  network: "Network",
  server: "Server",
  database: "Database",
  data: "Sensitive data",
  storage: "Storage",
};

const NODE_WIDTH = 200;
const NODE_ROW_Y = 30;
const CONTEXT_Y = 290;

function AttackNode({ data, selected }) {
  const Icon = NODE_ICONS[data.type] ?? CircleDot;

  const classes = [
    "graph-node",
    data.compromised ? "is-compromised" : "",
    data.blocked ? "is-blocked" : "",
    data.critical && !data.blocked ? "is-critical" : "",
    selected ? "is-selected" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      <Handle type="target" position={Position.Left} />
      <div className="graph-node__icon" aria-hidden="true">
        <Icon size={15} />
      </div>
      <div className="graph-node__body">
        <div className="graph-node__label">{data.label}</div>
        <div className="graph-node__type">
          {TYPE_LABELS[data.type]}
          {data.critical ? " · critical" : ""}
        </div>
      </div>
      {data.blocked && <span className="graph-node__flag">Blocked</span>}
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

/**
 * Builds the deterministic graph layout for a simulation result:
 * attack path nodes on the center row, context nodes below.
 */
function buildGraph(result) {
  const path = result.path;
  const context = result.graphContext ?? [];

  const nodes = path.map((node, index) => ({
    id: node.id,
    type: "attack",
    position: { x: index * NODE_WIDTH + 40, y: NODE_ROW_Y },
    data: {
      ...node,
      records: node.type === "data" ? result.records : undefined,
      note: node.type === "data" ? `${TYPE_LABELS[node.type]} targeted by the attack` : undefined,
    },
  }));

  context.forEach((node, index) => {
    nodes.push({
      id: node.id,
      type: "attack",
      position: { x: (index + 3) * NODE_WIDTH + 40, y: CONTEXT_Y },
      data: {
        ...node,
        compromised: false,
        blocked: false,
      },
    });
  });

  const hubId = path[Math.min(2, path.length - 1)]?.id;

  const edges = [];
  path.forEach((node, index) => {
    if (index === 0) return;
    const previous = path[index - 1];
    edges.push({
      id: `edge-${previous.id}-${node.id}`,
      source: previous.id,
      target: node.id,
      animated: !node.blocked && node.compromised,
      markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18 },
      style: node.blocked
        ? { stroke: "#D92D20", strokeWidth: 2 }
        : { stroke: "#155EEF", strokeWidth: 2 },
    });
  });

  if (hubId) {
    context.forEach((node) => {
      edges.push({
        id: `edge-ctx-${node.id}`,
        source: hubId,
        target: node.id,
        markerEnd: { type: MarkerType.ArrowClosed, width: 14, height: 14 },
        style: { stroke: "#C5D0DD", strokeWidth: 1.5, strokeDasharray: "5 5" },
      });
    });
  }

  return { nodes, edges };
}

function AttackGraph({ result, onSelect }) {
  const { nodes, edges } = useMemo(() => buildGraph(result), [result]);

  return (
    <div>
      <div className="graph-wrap">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={attackNodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.3}
          maxZoom={1.6}
          nodesDraggable={false}
          colorMode="light"
          proOptions={{ hideAttribution: true }}
          onNodeClick={(_, node) => onSelect?.(node.data)}
          onPaneClick={() => onSelect?.(null)}
          aria-label="Attack graph: zoom, pan, and click nodes for details"
        >
          <Background variant="dots" gap={26} size={1.4} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>

      <div className="graph-legend" aria-hidden="true">
        <span className="legend-item">
          <span className="legend-swatch" />
          Attack path
        </span>
        <span className="legend-item">
          <span className="legend-dot legend-dot--danger" />
          Compromised
        </span>
        <span className="legend-item">
          <span className="legend-swatch legend-swatch--danger" />
          Blocked
        </span>
        <span className="legend-item">
          <span className="legend-swatch legend-swatch--muted" />
          Unaffected context
        </span>
      </div>
    </div>
  );
}

const attackNodeTypes = { attack: AttackNode };

export default AttackGraph;
