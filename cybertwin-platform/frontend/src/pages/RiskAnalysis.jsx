import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import PageTitle from "../components/common/PageTitle";
import Badge from "../components/common/Badge";
import DemoNotice from "../components/common/DemoNotice";
import ErrorState from "../components/common/ErrorState";
import RiskOverview from "../components/risk/RiskOverview";
import RiskCategoryCard from "../components/risk/RiskCategoryCard";
import RiskDetail from "../components/risk/RiskDetail";
import SecurityControls from "../components/risk/SecurityControls";
import RiskComparison from "../components/risk/RiskComparison";
import MlInsights from "../components/dashboard/MlInsights";
import BlockchainEvidence from "../components/dashboard/BlockchainEvidence";

import { useAsync } from "../hooks/useAsync";
import { useTwin } from "../hooks/useTwin";
import { getRiskOverview } from "../services/riskService";
import { getSecurityControls } from "../services/controlService";
import { getTopBehavioralRisks } from "../services/mlService";
import { getEvidence } from "../services/blockchainService";

function RiskAnalysis() {
  const { version } = useTwin();
  const [selected, setSelected] = useState(null);
  const [searchParams] = useSearchParams();

  const overview = useAsync(getRiskOverview, [version]);
  const controls = useAsync(getSecurityControls, [version]);
  const mlRisks = useAsync(getTopBehavioralRisks);
  const evidence = useAsync(() => getEvidence());

  useEffect(() => {
    if (searchParams.get("focus") === "controls") {
      setTimeout(() => {
        document.getElementById("controls")?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    }
  }, [searchParams]);

  const categories = overview.data?.categories ?? [];

  return (
    <div className="page">
      <PageTitle
        title="Risk Analysis"
        subtitle="Understand why the organization is exposed and where security controls reduce risk."
        actions={
          overview.data ? (
            <Badge severity={overview.data.severity}>
              Posture {overview.data.overallRisk}/100 · {overview.data.severity.toUpperCase()}
            </Badge>
          ) : (
            <Badge tone="neutral">Calculating…</Badge>
          )
        }
      />

      <DemoNotice />

      {overview.loading || overview.error ? (
        overview.error ? (
          <ErrorState title="Unable to load risk analysis" onRetry={overview.retry} />
        ) : (
          <div className="card">
            <div className="skeleton skeleton-card" />
          </div>
        )
      ) : (
        <RiskOverview overview={overview.data} />
      )}

      <section className="section-grid grid-3" aria-label="Risk categories">
        {categories.map((category) => (
          <RiskCategoryCard
            key={category.id}
            category={category}
            selected={selected?.id === category.id}
            onSelect={setSelected}
          />
        ))}
      </section>

      <RiskDetail category={selected} />

      <div className="controls-layout" id="controls">
        <SecurityControls
          controls={controls.data}
          loading={controls.loading}
          error={controls.error}
          onRetry={controls.retry}
        />
        <RiskComparison />
      </div>

      <div className="section-grid grid-2">
        <MlInsights users={mlRisks.data} />
        <BlockchainEvidence evidence={evidence.data} />
      </div>
    </div>
  );
}

export default RiskAnalysis;
