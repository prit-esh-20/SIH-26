import { useMemo, useState } from "react";
import CurrentWell from "../components/dashboard/CurrentWell.jsx";
import RiskAlert from "../components/dashboard/RiskAlert.jsx";
import NearbyWellsMap from "../components/map/NearbyWellsMap.jsx";
import DepthTimeline from "../components/dashboard/DepthTimeline.jsx";
import HistoricalEvents from "../components/dashboard/HistoricalEvents.jsx";
import DrillingParameters from "../components/dashboard/DrillingParameters.jsx";
import FormationContext from "../components/dashboard/FormationContext.jsx";
import ComparableWells from "../components/dashboard/ComparableWells.jsx";
import DrillingCharts from "../components/dashboard/DrillingCharts.jsx";
import EvidencePanel from "../components/dashboard/EvidencePanel.jsx";
import { useWellContext } from "../context/WellContext.jsx";
import { getRiskAlerts, getWell } from "../data/mockData.js";

export default function Dashboard() {
  const { activeWellId } = useWellContext();
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [activeAlert, setActiveAlert] = useState(null);

  const well = getWell(activeWellId);

  const handleOpenEvidence = (alert) => {
    setActiveAlert(alert);
    setEvidenceOpen(true);
  };

  const formationNote = useMemo(() => {
    if (!well) return "";
    return `Current depth ${well.depth.toLocaleString("en-IN")} m in Formation ${well.formation}`;
  }, [well]);

  return (
    <div className="mx-auto max-w-[1720px] space-y-4 pb-8">
      {/* Level 1: current well state */}
      <CurrentWell />

      {/* Level 4-5: upcoming risk and evidence access */}
      {getRiskAlerts(activeWellId).length > 0 ? (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <RiskAlert onOpenEvidence={handleOpenEvidence} />
          </div>
          <div className="xl:col-span-1">
            <DepthTimeline />
          </div>
        </div>
      ) : (
        <DepthTimeline />
      )}

      {/* Level 2: nearby wells */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <NearbyWellsMap />
        <ComparableWells />
      </div>

      {/* Level 3: historical events */}
      <HistoricalEvents />

      {/* Level 6: technical parameters */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <DrillingParameters />
        <FormationContext />
      </div>

      <DrillingCharts />

      <EvidencePanel
        alert={activeAlert}
        open={evidenceOpen}
        onClose={() => setEvidenceOpen(false)}
      />
    </div>
  );
}
