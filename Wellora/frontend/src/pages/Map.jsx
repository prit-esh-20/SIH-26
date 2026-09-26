import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Map as MapIcon } from "lucide-react";
import PageHeader from "../components/intelligence/PageHeader.jsx";
import MapControls from "../components/map/MapControls.jsx";
import MapView from "../components/map/MapView.jsx";
import MapLegend from "../components/map/MapLegend.jsx";
import SelectedWellPanel from "../components/map/SelectedWellPanel.jsx";
import EventSummaryPanel from "../components/map/EventSummaryPanel.jsx";
import NearbyWellsTable from "../components/map/NearbyWellsTable.jsx";
import { useWellContext } from "../context/WellContext.jsx";
import { getComparableWells, getWell } from "../data/mockData.js";

export default function Map() {
  const { activeWellId, setActiveWellId } = useWellContext();
  const navigate = useNavigate();
  const well = getWell(activeWellId);

  const [filters, setFilters] = useState({
    query: "",
    radius: 10,
    formation: "all",
    event: "all",
    layers: { wells: true, events: true, density: false },
  });

  const comparable = useMemo(() => getComparableWells(activeWellId), [activeWellId]);

  const visibleWells = useMemo(
    () =>
      comparable.filter((c) => {
        if (filters.query && !c.wellId.toLowerCase().includes(filters.query.toLowerCase())) return false;
        if (filters.formation !== "all" && c.formation !== filters.formation) return false;
        if (c.distanceKm > filters.radius) return false;
        return true;
      }),
    [comparable, filters]
  );

  const selectedId = visibleWells.some((c) => c.wellId === filters.selectedWellId)
    ? filters.selectedWellId
    : (visibleWells[0]?.wellId ?? null);

  const handleSelect = (wellId) => setFilters((f) => ({ ...f, selectedWellId: wellId }));

  const handleViewWell = (wellId) => {
    setActiveWellId(activeWellId);
    navigate("/wells/intelligence");
  };

  return (
    <div className="mx-auto max-w-[1720px] space-y-4 pb-8">
      <PageHeader
        title="Map"
        subtitle="Explore nearby wells, comparable offsets, and historical drilling events."
      />

      {/* Context summary strip */}
      <section className="wl-card flex flex-wrap items-center gap-x-10 gap-y-3 px-6 py-3.5">
        <ContextItem label="Current Well" value={well?.id ?? "-"} />
        <ContextItem label="Depth" value={`${(well?.depth ?? 0).toLocaleString("en-IN")} m`} />
        <ContextItem label="Formation" value={well?.formation ?? "-"} />
        <ContextItem label="Radius" value={`${filters.radius} km`} />
        <span className="ml-auto flex items-center gap-2 text-[11px] text-wl-text-muted">
          <MapIcon size={12} />
          Representative prototype data
        </span>
      </section>

      <MapControls filters={filters} onChange={setFilters} />

      {/* Map + context panel */}
      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <MapView
            activeWellId={activeWellId}
            visibleWells={visibleWells}
            selectedWellId={selectedId}
            onSelect={handleSelect}
            filters={filters}
          />
          <NearbyWellsTable
            wells={visibleWells}
            selectedWellId={selectedId}
            onSelect={handleSelect}
          />
        </div>
        <div className="space-y-4">
          <SelectedWellPanel
            activeWellId={activeWellId}
            selectedWellId={selectedId}
            onViewWell={handleViewWell}
          />
          <EventSummaryPanel
            activeWellId={activeWellId}
            eventFilter={filters.event}
            onEventFilter={(v) => setFilters((f) => ({ ...f, event: v }))}
          />
          <MapLegend />
        </div>
      </div>
    </div>
  );
}

function ContextItem({ label, value }) {
  return (
    <div>
      <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-wl-text-muted">
        {label}
      </div>
      <div className="mt-0.5 text-[16px] font-semibold text-wl-text-primary">{value}</div>
    </div>
  );
}
