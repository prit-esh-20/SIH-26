import { useMemo, useState } from "react";
import PageHeader from "../components/intelligence/PageHeader.jsx";
import CurrentWellContext from "../components/intelligence/CurrentWellContext.jsx";
import WellFilters from "../components/intelligence/WellFilters.jsx";
import ComparableWellsTable from "../components/intelligence/ComparableWellsTable.jsx";
import SelectedWellSummary from "../components/intelligence/SelectedWellSummary.jsx";
import SimilarityBreakdown from "../components/intelligence/SimilarityBreakdown.jsx";
import WhyComparable from "../components/intelligence/WhyComparable.jsx";
import WellComparison from "../components/intelligence/WellComparison.jsx";
import HistoricalEventTimeline from "../components/intelligence/HistoricalEventTimeline.jsx";
import DepthCorrelation from "../components/intelligence/DepthCorrelation.jsx";
import EventParameters from "../components/intelligence/EventParameters.jsx";
import MitigationPanel from "../components/intelligence/MitigationPanel.jsx";
import SourceEvidenceCard from "../components/intelligence/SourceEvidenceCard.jsx";
import SourceEvidenceDrawer from "../components/intelligence/SourceEvidenceDrawer.jsx";
import RelatedWells from "../components/intelligence/RelatedWells.jsx";
import { getEventsForWell, getEventById, historicalEvents } from "../data/mockData.js";

const DEFAULT_FILTERS = {
  query: "",
  formation: "all",
  distance: "all",
  similarity: "all",
  event: "all",
  depthScope: "relevant",
};

export default function WellIntelligence() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selectedWellId, setSelectedWellId] = useState("W-201");
  const [selectedEventId, setSelectedEventId] = useState("EV-001");
  const [evidenceOpen, setEvidenceOpen] = useState(false);

  const eventTypes = useMemo(
    () => [...new Set(historicalEvents.map((e) => e.eventType))].sort(),
    []
  );

  // Keep the selected event valid when the selected well changes.
  const wellEventIds = useMemo(
    () => new Set(getEventsForWell(selectedWellId).map((e) => e.id)),
    [selectedWellId]
  );
  const activeEventId = wellEventIds.has(selectedEventId) ? selectedEventId : null;
  const selectedEvent = activeEventId ? getEventById(activeEventId) : null;

  const handleSelectWell = (wellId) => {
    setSelectedWellId(wellId);
    const first = getEventsForWell(wellId).sort((a, b) => a.depth - b.depth)[0];
    setSelectedEventId(first ? first.id : null);
  };

  return (
    <div className="mx-auto max-w-[1720px] space-y-4 pb-8">
      <PageHeader
        title="Well Intelligence"
        subtitle="Compare the active well with historical offset wells and review relevant drilling experience."
      />

      {/* Baseline */}
      <CurrentWellContext />

      {/* Filters */}
      <WellFilters filters={filters} onChange={setFilters} eventTypes={eventTypes} />

      {/* Comparable wells */}
      <ComparableWellsTable
        filters={filters}
        selectedWellId={selectedWellId}
        onSelect={handleSelectWell}
      />

      {/* Selected well */}
      <SelectedWellSummary selectedWellId={selectedWellId} />

      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-2">
        <SimilarityBreakdown selectedWellId={selectedWellId} />
        <WhyComparable selectedWellId={selectedWellId} />
      </div>

      <WellComparison selectedWellId={selectedWellId} selectedEvent={selectedEvent} />

      {/* Events: left column stacks the timeline with event parameters so
          heights stay content-driven and no artificial gap appears below the
          shorter column. */}
      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <HistoricalEventTimeline
            selectedWellId={selectedWellId}
            selectedEventId={activeEventId}
            onSelectEvent={setSelectedEventId}
          />
          <EventParameters selectedEvent={selectedEvent} />
        </div>
        <div className="space-y-4">
          {selectedEvent && (
            <DepthCorrelation selectedWellId={selectedWellId} selectedEvent={selectedEvent} />
          )}
          <SourceEvidenceCard
            selectedEvent={selectedEvent}
            onViewEvidence={() => setEvidenceOpen(true)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <MitigationPanel selectedEvent={selectedEvent} />
        </div>
        <RelatedWells selectedWellId={selectedWellId} onSelect={handleSelectWell} />
      </div>

      <SourceEvidenceDrawer
        event={selectedEvent}
        open={evidenceOpen}
        onClose={() => setEvidenceOpen(false)}
      />
    </div>
  );
}
