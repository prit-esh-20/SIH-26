import { Boxes, Layers, Radar, TriangleAlert } from "lucide-react";

import Card from "../common/Card";
import MetricCard from "../dashboard/MetricCard";
import RiskScoreCard from "../dashboard/RiskScoreCard";

function RiskOverview({ overview }) {
  if (!overview) return null;

  return (
    <div className="risk-overview-grid">
      <RiskScoreCard score={overview.overallRisk} severity={overview.severity} />

      <Card title="Exposure Summary">
        <div className="risk-stat-grid">
          <MetricCard
            label="Blast Radius"
            value={`${overview.blastRadius}`}
            unit="%"
            status={overview.blastRadius > 55 ? "High" : "Moderate"}
            statusTone={overview.blastRadius > 55 ? "warning" : "info"}
            icon={Radar}
          />
          <MetricCard
            label="Critical Assets"
            value={overview.criticalAssets}
            status={`Protected: ${overview.protectedCritical}`}
            statusTone="success"
            icon={Layers}
          />
          <MetricCard
            label="Attack Surface"
            value={overview.attackSurface}
            status="Monitored"
            statusTone="info"
            icon={Boxes}
          />
        </div>

        <div className="risk-detail-recommendation risk-overview-hint">
          <TriangleAlert size={14} aria-hidden="true" />
          <span>
            Overall posture is derived from the digital twin's enabled controls. Toggle a
            control below to see its impact on the organization's risk.
          </span>
        </div>
      </Card>
    </div>
  );
}

export default RiskOverview;
