import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Map as MapIcon, Landmark, FileText } from "lucide-react";
import PageHeader from "../components/intelligence/PageHeader.jsx";
import EventsFilterBar, {
  EMPTY_EVENT_FILTERS,
  applyEventFilters,
} from "../components/events/EventsFilterBar.jsx";
import EventsTable from "../components/events/EventsTable.jsx";
import EventDetailPanel from "../components/events/EventDetailPanel.jsx";
import EventContextPanel from "../components/events/EventContextPanel.jsx";
import EventTypeSummary from "../components/events/EventTypeSummary.jsx";
import RelatedWellsCard from "../components/events/RelatedWellsCard.jsx";
import SourceEvidenceDrawer from "../components/intelligence/SourceEvidenceDrawer.jsx";
import { useWellContext } from "../context/WellContext.jsx";
import { getWell, historicalEvents } from "../data/mockData.js";
// Map page: navigate("/map") reuses the existing Operational Map view.
// Well Intelligence deep-links reuse the shared WellContext active well.

export default function HistoricalEvents() {
  const { activeWellId } = useWellContext();
  const navigate = useNavigate();

  const [filters, setFilters] = useState(EMPTY_EVENT_FILTERS);
  const [selectedEventId, setSelectedEventId] = useState("EV-001");
  const [sort, setSort] = useState({ key: "depth", dir: "asc" });
  const [evidenceOpen, setEvidenceOpen] = useState(false);

  const current = getWell(activeWellId);

  const filtered = useMemo(() => applyEventFilters(historicalEvents, filters), [filters]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    list.sort((a, b) => {
      const dir = sort.dir === "asc" ? 1 : -1;
      const va = a[sort.key];
      const vb = b[sort.key];
      if (typeof va === "number" && typeof vb === "number") return (va - vb) * dir;
      return String(va).localeCompare(String(vb)) * dir;
    });
    return list;
  }, [filtered, sort]);

  const totalCounts = useMemo(() => {
    const counts = {};
    for (const e of historicalEvents) {
      counts[e.eventType] = (counts[e.eventType] ?? 0) + 1;
    }
    return counts;
  }, []);

  const selectedEvent = sorted.find((e) => e.id === selectedEventId) ?? null;

  const summary = useMemo(() => {
    const depths = historicalEvents.map((e) => e.depth);
    const forms = [...new Set(historicalEvents.map((e) => e.formation))];
    return {
      events: historicalEvents.length,
      wells: new Set(historicalEvents.map((e) => e.wellId)).size,
      min: Math.min(...depths),
      max: Math.max(...depths),
      formations: forms.join(" / "),
    };
  }, []);

  return (
    <div className="mx-auto max-w-[1720px] space-y-4 pb-8">
      <PageHeader
        title="Historical Events"
        subtitle="Review historical drilling events, operating conditions, mitigation responses, and outcomes across representative wells."
        aside={
          <span className="flex items-center gap-2 text-[11px] text-wl-text-muted">
            <Landmark size={12} />
            Representative prototype data
          </span>
        }
      />

      {/* Summary strip */}
      <section className="wl-card flex flex-wrap items-center gap-x-10 gap-y-3 px-6 py-3.5">
        <SummaryItem label="Events" value={summary.events} />
        <SummaryItem label="Wells" value={summary.wells} />
        <SummaryItem
          label="Depth Range"
          value={`${summary.min.toLocaleString("en-IN")} - ${summary.max.toLocaleString("en-IN")} m`}
        />
        <SummaryItem label="Formation" value={summary.formations} />
        <SummaryItem label="Region" value="Assam, India" />
        <span className="ml-auto max-w-[340px] text-right text-[10px] leading-relaxed text-wl-text-muted">
          Representative prototype data. Production deployment would use authorized operator datasets.
        </span>
      </section>

      <EventsFilterBar filters={filters} onChange={setFilters} />

      {/* Table + side panels */}
      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <EventsTable
            events={sorted}
            total={historicalEvents.length}
            selectedEventId={selectedEventId}
            onSelect={setSelectedEventId}
            sort={sort}
            onSortChange={setSort}
          />
          <EventDetailPanel event={selectedEvent} />
        </div>
        <div className="space-y-4">
          <EventTypeSummary
            totalCounts={totalCounts}
            activeType={filters.type}
            onSelectType={(type) => setFilters((f) => ({ ...f, type }))}
          />
          <EventContextPanel event={selectedEvent} />
          <SourceEvidenceMini event={selectedEvent} onView={() => setEvidenceOpen(true)} />
          <RelatedWellsCard wellId={selectedEvent?.wellId} />
          <button
            type="button"
            className="wl-btn w-full justify-center"
            onClick={() => navigate("/map")}
          >
            <MapIcon size={12} />
            View on Map
          </button>
        </div>
      </div>

      <SourceEvidenceDrawer
        event={selectedEvent}
        open={evidenceOpen}
        onClose={() => setEvidenceOpen(false)}
      />
    </div>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div>
      <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-wl-text-muted">
        {label}
      </div>
      <div className="tabular mt-0.5 text-[16px] font-semibold text-wl-text-primary">{value}</div>
    </div>
  );
}

function SourceEvidenceMini({ event, onView }) {
  if (!event) return null;
  return (
    <section className="wl-card flex flex-col">
      <div className="px-5 py-4">
        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-wl-text-muted">
          Source Evidence
        </div>
        <div className="mt-1.5 flex items-center gap-2 text-[14px] font-semibold text-wl-text-primary">
          <FileText size={13} className="text-wl-text-secondary" />
          {event.document}
        </div>
        <div className="mt-0.5 text-[11px] text-wl-text-muted">
          Page {event.page} · {event.eventType} · {event.depth.toLocaleString("en-IN")} m · {event.formation}
        </div>
        <button type="button" className="wl-btn wl-btn-primary mt-3" onClick={onView}>
          View Evidence
        </button>
        <div className="mt-2 text-[9.5px] uppercase tracking-[0.08em] text-wl-text-muted">
          Representative source reference
        </div>
      </div>
    </section>
  );
}
