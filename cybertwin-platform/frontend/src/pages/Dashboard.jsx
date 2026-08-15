import { Activity, Building2, Landmark, ShieldAlert } from "lucide-react";

import PageTitle from "../components/common/PageTitle";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import StatusIndicator from "../components/common/StatusIndicator";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";

import MetricCard from "../components/dashboard/MetricCard";
import RiskScoreCard from "../components/dashboard/RiskScoreCard";
import RiskBreakdown from "../components/dashboard/RiskBreakdown";
import AttackPathSummary from "../components/dashboard/AttackPathSummary";
import SecurityEvents from "../components/dashboard/SecurityEvents";
import QuickActions from "../components/dashboard/QuickActions";
import MlInsights from "../components/dashboard/MlInsights";
import BlockchainEvidence from "../components/dashboard/BlockchainEvidence";

import { useAsync } from "../hooks/useAsync";

import {
  getDashboardKpis,
  getRiskOverview,
  getAttackPaths,
  getSecurityEvents,
} from "../services/riskService";

import { getOrganization } from "../services/organizationService";
import { getTopBehavioralRisks } from "../services/mlService";
import { getEvidence } from "../services/blockchainService";

const ICONS = {
  "overall-risk": ShieldAlert,
  assets: Building2,
  "critical-assets": Landmark,
  "attack-paths": Activity,
};

function Dashboard() {
  const kpis = useAsync(getDashboardKpis);
  const overview = useAsync(getRiskOverview);
  const paths = useAsync(getAttackPaths);
  const events = useAsync(getSecurityEvents);
  const organization = useAsync(getOrganization);
  const mlRisks = useAsync(getTopBehavioralRisks);
  const evidence = useAsync(() => getEvidence());

  const overviewData = overview.data;

  const breakdownCategories =
    overviewData?.categories?.filter((category) =>
      ["identity", "network", "endpoint", "data", "privilege"].includes(
        category.id,
      ),
    ) ?? [];

  return (
    <div className="page">
      {/* =====================================================
          PAGE HEADER
          ===================================================== */}

      <PageTitle
        title="Cyber Risk Overview"
        subtitle="Monitor your organization's simulated cyber posture and attack exposure."
        actions={
          <div className="dashboard-header-actions">
            {organization.data && (
              <div className="dashboard-organization-name">
                {organization.data.name}
              </div>
            )}

            {organization.loading ? (
              <StatusIndicator
                tone="neutral"
                label="Digital Twin: Syncing…"
              />
            ) : organization.data ? (
              <StatusIndicator
                tone="success"
                label={`Digital Twin: ${organization.data.twinStatus}`}
              />
            ) : null}
          </div>
        }
      />

      {/* =====================================================
          KPI METRICS
          ===================================================== */}

      <div className="section-grid grid-4">
        {kpis.loading || !kpis.data ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div className="card" key={i}>
              <div className="skeleton skeleton-line" />
              <div className="skeleton skeleton--lg skeleton-line--w40" />
            </div>
          ))
        ) : kpis.error ? (
          <ErrorState
            title="Unable to load risk overview"
            onRetry={kpis.retry}
          />
        ) : (
          kpis.data.map((kpi) => (
            <MetricCard
              key={kpi.id}
              label={kpi.label}
              value={kpi.value}
              unit={kpi.unit}
              status={kpi.status}
              statusTone={kpi.statusTone}
              icon={ICONS[kpi.id]}
            />
          ))
        )}
      </div>

      {/* =====================================================
          MAIN DASHBOARD
          ===================================================== */}

      <div className="dashboard-main-grid">
        {/* ===================================================
            LEFT COLUMN
            =================================================== */}

        <div className="dashboard-main-left">
          {/* Risk Score + Risk Breakdown */}

          <div className="dashboard-risk-overview">
            <div className="dashboard-risk-score">
              {overview.loading || !overview.data ? (
                <LoadingState />
              ) : overview.error ? (
                <ErrorState
                  title="Unable to load risk overview"
                  onRetry={overview.retry}
                />
              ) : (
                <RiskScoreCard
                  score={overviewData.overallRisk}
                  severity={overviewData.severity}
                />
              )}
            </div>

            <div className="dashboard-risk-breakdown">
              {overview.loading || !overview.data ? (
                <LoadingState />
              ) : (
                <RiskBreakdown categories={breakdownCategories} />
              )}
            </div>
          </div>

          {/* Attack Paths */}

          <div className="dashboard-attack-paths">
            {paths.loading ? (
              <LoadingState variant="rows" />
            ) : paths.error ? (
              <ErrorState
                title="Unable to load attack paths"
                onRetry={paths.retry}
              />
            ) : (
              <AttackPathSummary paths={paths.data} />
            )}
          </div>
        </div>

        {/* ===================================================
            RIGHT COLUMN
            =================================================== */}

        <div className="dashboard-main-right">
          {/* ML + Blockchain */}

          <div className="dashboard-risk-sidebar">
            <MlInsights users={mlRisks.data} />
            <BlockchainEvidence evidence={evidence.data} />
          </div>

          {/* Security Events */}

          <div className="dashboard-security-events">
            {events.loading ? (
              <LoadingState variant="rows" />
            ) : events.error ? (
              <ErrorState
                title="Unable to load security events"
                onRetry={events.retry}
              />
            ) : (
              <SecurityEvents events={events.data} />
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          QUICK ACTIONS
          ===================================================== */}

      <Card
        title="Quick Actions"
        action={
          <Badge tone="neutral">
            Recommended workflow
          </Badge>
        }
      >
        <QuickActions />
      </Card>
    </div>
  );
}

export default Dashboard;