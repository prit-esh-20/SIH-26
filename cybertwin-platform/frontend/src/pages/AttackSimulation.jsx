import { Suspense, lazy, useState } from "react";
import { PlayCircle, ScanSearch } from "lucide-react";

import PageTitle from "../components/common/PageTitle";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import SimulationForm from "../components/simulation/SimulationForm";
import SimulationStatus from "../components/simulation/SimulationStatus";
import SimulationResult from "../components/simulation/SimulationResult";
import SimulationHistory from "../components/simulation/SimulationHistory";
import NodeDetails from "../components/simulation/NodeDetails";
import CounterfactualComparison from "../components/simulation/CounterfactualComparison";
import MlInsights from "../components/dashboard/MlInsights";
import BlockchainEvidence from "../components/dashboard/BlockchainEvidence";

import { useAsync } from "../hooks/useAsync";
import { useSimulationRunner } from "../hooks/useSimulationRunner";
import { useTwin } from "../hooks/useTwin";
import { getScenarios, getSimulationUsers } from "../services/simulationService";
import { getTopBehavioralRisks } from "../services/mlService";
import { getEvidence } from "../services/blockchainService";
import { getSimulationHistory } from "../utils/twinStore";
import { SIMULATION_STEPS } from "../utils/mockData";

const AttackGraph = lazy(() => import("../components/simulation/AttackGraph"));

function AttackSimulation() {
  const scenarios = useAsync(getScenarios);
  const users = useAsync(getSimulationUsers);
  const mlRisks = useAsync(getTopBehavioralRisks);
  useTwin();

  const { phase, activeStep, result, error, run, running, setResult } = useSimulationRunner();
  const [counterfactual, setCounterfactual] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [evidence, setEvidence] = useState(null);

  const refreshEvidence = (simulationId) => {
    getEvidence(simulationId).then(setEvidence);
  };

  const handleRun = async (config) => {
    setCounterfactual(null);
    setSelectedNode(null);
    const newResult = await run(config);
    if (newResult) refreshEvidence(newResult.id);
  };

  const handleCounterfactual = async (controlId) => {
    if (!result) return;

    const baseConfig = {
      scenarioId: result.scenarioId,
      userId: "user-placeholder",
      mfa: result.mfa,
      control: result.control === "mfa" ? "none" : result.control,
    };

    const user = users.data?.find((u) => u.name === result.userName);
    const after = await run(
      { ...baseConfig, userId: user?.id ?? users.data?.[0]?.id, controlId },
      "counterfactual",
    );
    if (after) setCounterfactual(after);
  };

  const handleHistorySelect = (entry) => {
    setCounterfactual(null);
    setSelectedNode(null);
    setResult(entry);
    refreshEvidence(entry.id);
  };

  const scrollToForm = () => {
    document.getElementById("sim-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="page">
      <PageTitle
        title="Attack Simulation"
        subtitle="Run controlled what-if scenarios against the organization's digital twin."
        actions={<Badge tone="violet">SIMULATED</Badge>}
      />

      <div className="sim-layout">
        <div className="sim-side">
          <div id="sim-form">
            {scenarios.loading || users.loading ? (
              <Card>
                <div className="skeleton skeleton-line" />
                <div className="skeleton skeleton-line" />
                <div className="skeleton skeleton-line skeleton-line--w60" />
              </Card>
            ) : scenarios.error || users.error ? (
              <ErrorState title="Unable to load simulation options" onRetry={scenarios.retry} />
            ) : (
              <SimulationForm
                scenarios={scenarios.data}
                users={users.data}
                running={running}
                onRun={handleRun}
              />
            )}
          </div>

          <SimulationHistory
            entries={getSimulationHistory()}
            activeId={result?.id}
            onSelect={handleHistorySelect}
          />
        </div>

        <div className="sim-main">
          {error && (
            <ErrorState title="Simulation failed" text={error.message} />
          )}

          {phase === "running" && (
            <SimulationStatus steps={SIMULATION_STEPS} activeStep={activeStep} />
          )}

          {phase === "idle" && !result && !error && (
            <EmptyState
              icon={ScanSearch}
              title="No simulations yet"
              text="Run your first attack simulation to analyze organizational risk."
              action={
                <Button variant="primary" size="sm" icon={PlayCircle} onClick={scrollToForm}>
                  Run Simulation
                </Button>
              }
            />
          )}

          {result && (
            <>
              <SimulationResult result={result} />

              <div className="graph-shell">
                <Suspense
                  fallback={
                    <Card title="Attack Graph">
                      <div className="graph-wrap graph-wrap--loading">
                        <div className="skeleton" />
                      </div>
                    </Card>
                  }
                >
                  <Card
                    title="Attack Graph"
                    action={
                      <Badge tone="neutral">
                        {result.path.filter((n) => n.compromised).length} compromised ·{" "}
                        {result.blockedAt ? "blocked" : "full reach"}
                      </Badge>
                    }
                  >
                    <AttackGraph result={result} onSelect={setSelectedNode} />
                  </Card>
                </Suspense>

                <NodeDetails node={selectedNode} />
              </div>

              <CounterfactualComparison
                result={result}
                running={running}
                onRun={handleCounterfactual}
                counterfactual={counterfactual}
              />

              <div className="section-grid grid-2">
                <MlInsights users={mlRisks.data} />
                <BlockchainEvidence evidence={evidence} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AttackSimulation;
