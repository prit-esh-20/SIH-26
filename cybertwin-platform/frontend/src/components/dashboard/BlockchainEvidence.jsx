import { FileCheck } from "lucide-react";

import Card from "../common/Card";
import Badge from "../common/Badge";
import { shortHash } from "../../utils/format";

/**
 * Blockchain-backed evidence record. Display-only — the frontend never
 * performs any blockchain operation; it renders backend-verified evidence.
 */
function BlockchainEvidence({ evidence }) {
  if (!evidence) return null;

  return (
    <Card
      title={
        <span className="teaser-card__title">
          <FileCheck size={15} />
          Evidence Ledger
        </span>
      }
      action={<Badge tone="success">Integrity verified</Badge>}
    >
      <div className="teaser-card">
        <div className="evidence-row">
          <span className="evidence-row__label">Simulation</span>
          <span className="evidence-row__value">{evidence.simulationId}</span>
        </div>
        <div className="evidence-row">
          <span className="evidence-row__label">Event</span>
          <span className="evidence-row__value">{evidence.event}</span>
        </div>
        <div className="evidence-row">
          <span className="evidence-row__label">Timestamp</span>
          <span className="evidence-row__value">{evidence.timestamp}</span>
        </div>
        <div className="evidence-row">
          <span className="evidence-row__label">Ledger</span>
          <span className="evidence-row__value">{evidence.ledger} · Block {evidence.block}</span>
        </div>
        <div className="evidence-row">
          <span className="evidence-row__label">Hash</span>
          <span className="evidence-row__value">{shortHash(evidence.hash)}</span>
        </div>
      </div>
    </Card>
  );
}

export default BlockchainEvidence;
