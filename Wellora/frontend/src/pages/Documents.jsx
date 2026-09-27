import { useMemo, useState } from "react";
import { FileText } from "lucide-react";
import PageHeader from "../components/intelligence/PageHeader.jsx";
import DocumentFilters, {
  EMPTY_DOCUMENT_FILTERS,
  applyDocumentFilters,
} from "../components/documents/DocumentFilters.jsx";
import DocumentTable from "../components/documents/DocumentTable.jsx";
import DocumentDetails from "../components/documents/DocumentDetails.jsx";
import DocumentPreview from "../components/documents/DocumentPreview.jsx";
import SourceEvidenceMini from "../components/documents/SourceEvidenceMini.jsx";
import SourceEvidenceDrawer from "../components/intelligence/SourceEvidenceDrawer.jsx";
import { documentLibrary, getEventById } from "../data/mockData.js";

export default function Documents() {
  const [filters, setFilters] = useState(EMPTY_DOCUMENT_FILTERS);
  const [selectedId, setSelectedId] = useState("DDR-W201-P37");
  const [sort, setSort] = useState({ key: "date", dir: "desc" });
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = useMemo(() => applyDocumentFilters(documentLibrary, filters), [filters]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    list.sort((a, b) => {
      const dir = sort.dir === "asc" ? 1 : -1;
      const va = a[sort.key] ?? "";
      const vb = b[sort.key] ?? "";
      if (typeof va === "number" && typeof vb === "number") return (va - vb) * dir;
      return String(va).localeCompare(String(vb)) * dir;
    });
    return list;
  }, [filtered, sort]);

  // Keep the selection valid when filters hide the selected document.
  const effectiveSelectedId = sorted.some((d) => d.id === selectedId)
    ? selectedId
    : (sorted[0]?.id ?? null);
  const selected = sorted.find((d) => d.id === effectiveSelectedId) ?? null;
  const selectedEvent = selected?.eventId ? getEventById(selected.eventId) : null;

  const summary = useMemo(() => {
    const wells = new Set(documentLibrary.map((d) => d.wellId));
    const types = new Set(documentLibrary.map((d) => d.type));
    return { documents: documentLibrary.length, wells: wells.size, types: types.size };
  }, []);

  return (
    <div className="mx-auto max-w-[1720px] space-y-4 pb-8">
      <PageHeader
        title="Documents"
        subtitle="Access drilling reports, event records, well documents, and supporting evidence."
        aside={
          <span className="flex items-center gap-2 text-[11px] text-wl-text-muted">
            <FileText size={12} />
            Representative prototype data
          </span>
        }
      />

      {/* Summary strip */}
      <section className="wl-card flex flex-wrap items-center gap-x-10 gap-y-3 px-6 py-3.5">
        <SummaryItem label="Documents" value={summary.documents} />
        <SummaryItem label="Wells Covered" value={summary.wells} />
        <SummaryItem label="Document Types" value={summary.types} />
        <SummaryItem label="Region" value="Assam, India" />
        <span className="ml-auto max-w-[340px] text-right text-[10px] leading-relaxed text-wl-text-muted">
          Representative prototype data. Production deployment would use authorized operator
          datasets.
        </span>
      </section>

      <DocumentFilters filters={filters} onChange={setFilters} />

      {/* Table + side panels */}
      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <DocumentTable
            documents={sorted}
            total={documentLibrary.length}
            selectedId={effectiveSelectedId}
            onSelect={setSelectedId}
            sort={sort}
            onSortChange={setSort}
          />
          <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
            <DocumentDetails document={selected} onViewDocument={() => setDrawerOpen(true)} />
            <DocumentPreview document={selected} onView={() => setDrawerOpen(true)} />
          </div>
        </div>
        <div className="space-y-4">
          <SourceEvidenceMini document={selected} />
        </div>
      </div>

      <SourceEvidenceDrawer
        event={selectedEvent}
        open={drawerOpen && Boolean(selectedEvent)}
        onClose={() => setDrawerOpen(false)}
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
