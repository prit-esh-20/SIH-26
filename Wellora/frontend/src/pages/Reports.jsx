import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileBarChart, FileText } from "lucide-react";
import PageHeader from "../components/intelligence/PageHeader.jsx";
import SectionHeader from "../components/common/SectionHeader.jsx";
import ReportsFilterBar, {
  EMPTY_REPORT_FILTERS,
  applyReportFilters,
} from "../components/reports/ReportsFilterBar.jsx";
import ReportsTable from "../components/reports/ReportsTable.jsx";
import ReportAnalysis from "../components/reports/ReportAnalysis.jsx";
import ReportPreview from "../components/reports/ReportPreview.jsx";
import GenerateReportModal, {
  GenerateSuccessToast,
} from "../components/reports/GenerateReportModal.jsx";
import { useWellContext } from "../context/WellContext.jsx";
import {
  getReportDocuments,
  getReportEvidence,
  getReports,
  getWell,
} from "../data/mockData.js";

export default function Reports() {
  const navigate = useNavigate();
  const { activeWellId } = useWellContext();
  const [filters, setFilters] = useState(EMPTY_REPORT_FILTERS);
  const [selectedId, setSelectedId] = useState("RPT-001");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [extraReports, setExtraReports] = useState([]);
  const [toast, setToast] = useState(null);

  const allReports = useMemo(() => [...extraReports, ...getReports()], [extraReports]);
  const filtered = useMemo(() => applyReportFilters(allReports, filters), [allReports, filters]);

  const effectiveSelectedId =
    filtered.some((r) => r.id === selectedId) ? selectedId : (filtered[0]?.id ?? null);
  const selected = filtered.find((r) => r.id === effectiveSelectedId) ?? null;
  const current = getWell(activeWellId);

  const handleSelect = (id, openPreview = false) => {
    setSelectedId(id);
    if (openPreview) setPreviewOpen(true);
  };

  const handleGenerate = (report) => {
    setExtraReports((list) => [report, ...list]);
    setModalOpen(false);
    setToast(report);
    setSelectedId(report.id);
  };

  const summaryItems = [
    { label: "Current Well", value: activeWellId },
    { label: "Depth", value: current ? `${current.depth.toLocaleString("en-IN")} m` : "-" },
    { label: "Formation", value: current?.formation ?? "-" },
    { label: "Hole Section", value: current?.holeSection ?? "-" },
    { label: "Status", value: current?.status ?? "-" },
    { label: "Region", value: "Assam, India" },
  ];

  return (
    <div className="mx-auto max-w-[1720px] space-y-4 pb-8">
      <PageHeader
        title="Reports"
        subtitle="Review drilling intelligence reports generated from historical wells, events, alerts, and supporting evidence."
        aside={
          <span className="flex items-center gap-2 text-[11px] text-wl-text-muted">
            <FileBarChart size={12} />
            Representative prototype data
          </span>
        }
      />

      {/* Current well summary */}
      <section className="wl-card flex flex-wrap items-center gap-x-10 gap-y-3 px-6 py-3.5">
        {summaryItems.map((s) => (
          <SummaryItem key={s.label} label={s.label} value={s.value} />
        ))}
        <span className="ml-auto max-w-[340px] text-right text-[10px] leading-relaxed text-wl-text-muted">
          Representative prototype data. Production deployment would use authorized operator datasets.
        </span>
      </section>

      <ReportsFilterBar
        filters={filters}
        onChange={setFilters}
        onGenerate={() => setModalOpen(true)}
      />

      {/* Report library */}
      <ReportsTable
        reports={filtered}
        total={allReports.length}
        selectedId={effectiveSelectedId}
        onSelect={handleSelect}
      />

      {/* Selected report + actions */}
      {selected && (
        <section className="wl-card flex flex-col">
          <SectionHeader
            icon={FileText}
            title="Selected Report"
            actions={
              <span className="text-[10.5px] text-wl-text-muted">
                {selected.status} · {selected.generated}
              </span>
            }
          />
          <div className="px-5 py-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <span className="text-[15px] font-semibold text-wl-text-primary">{selected.title}</span>
                <span className="text-[12px] text-wl-text-secondary">{selected.type}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="wl-btn wl-btn-primary"
                  onClick={() => setPreviewOpen((v) => !v)}
                >
                  {previewOpen ? "Hide Report" : "View Report"}
                </button>
                <button
                  type="button"
                  className="wl-btn"
                  title="Prototype report export"
                  onClick={() => setToast({ ...selected, title: `${selected.title} (export preview)` })}
                >
                  Download Report
                </button>
                <button type="button" className="wl-btn" onClick={() => setModalOpen(true)}>
                  Generate New Report
                </button>
              </div>
            </div>

            <div className="mt-3.5 grid grid-cols-2 gap-x-6 gap-y-2.5 border-t border-wl-border pt-3.5 sm:grid-cols-3 lg:grid-cols-6">
              <Kv label="Report Type" value={selected.type} />
              <Kv label="Well" value={selected.wellId} />
              <Kv label="Generated" value={selected.generated} mono />
              <Kv label="Current Depth" value={`${selected.depth.toLocaleString("en-IN")} m`} mono />
              <Kv label="Formation" value={selected.formation} />
              <Kv label="Report Status" value={selected.status} />
            </div>
          </div>
        </section>
      )}

      {/* Analysis: summary + risk, then comparable wells + evidence, then documents */}
      <ReportAnalysis report={selected} />

      {/* Report preview (sticky on desktop when open) */}
      {previewOpen && selected && (
        <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
          <ReportPreview report={selected} />
          <div className="xl:sticky xl:top-20 xl:max-h-[calc(100vh-140px)] xl:overflow-y-auto">
            <SelectedEvidencePanel report={selected} />
          </div>
        </div>
      )}

      <GenerateReportModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onGenerate={handleGenerate}
        wellId={activeWellId}
      />
      <GenerateSuccessToast report={toast} onClose={() => setToast(null)} />
    </div>
  );
}

// Compact companion card shown beside the preview: evidence + sources with
// navigation, so the sticky column pairs with the document preview.
function SelectedEvidencePanel({ report }) {
  const navigate = useNavigate();
  const evidence = getReportEvidence(report);
  const docs = getReportDocuments(report);

  return (
    <section className="wl-card flex flex-col">
      <SectionHeader
        icon={FileText}
        title="Report Basis"
        actions={<span className="text-[10.5px] text-wl-text-muted">References</span>}
      />
      <div className="px-5 py-4">
        <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-wl-text-muted">
          Historical events ({evidence.length})
        </div>
        <div className="mt-2 space-y-1.5">
          {evidence.map((ev) => (
            <button
              key={ev.id}
              type="button"
              onClick={() => navigate("/events")}
              className="flex w-full items-center gap-2.5 rounded-[5px] border border-wl-border bg-wl-surface-2 px-3 py-2 text-left transition-colors duration-100 hover:border-wl-accent hover:bg-wl-accent-faint"
            >
              <span className="tabular font-mono text-[11.5px] font-semibold text-wl-text-primary">
                {ev.depth.toLocaleString("en-IN")} m
              </span>
              <span className="text-[11.5px] text-wl-text-primary">{ev.eventType}</span>
              <span className="text-[11px] text-wl-text-secondary">{ev.wellId}</span>
              <span className="ml-auto tabular font-mono text-[10.5px] text-wl-text-muted">
                {ev.nptHours} h
              </span>
            </button>
          ))}
        </div>

        <div className="mt-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-wl-text-muted">
          Source documents ({docs.length})
        </div>
        <div className="mt-2 space-y-1.5">
          {docs.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => navigate("/documents")}
              className="flex w-full items-center gap-2.5 rounded-[5px] border border-wl-border bg-wl-surface-2 px-3 py-2 text-left transition-colors duration-100 hover:border-wl-accent hover:bg-wl-accent-faint"
            >
              <span className="font-mono text-[11.5px] font-semibold text-wl-text-primary">
                {d.documentId}
              </span>
              <span className="text-[11px] text-wl-text-secondary">p.{d.page}</span>
              <span className="ml-auto text-[11px] text-wl-text-muted">{d.type}</span>
            </button>
          ))}
        </div>

        <div className="mt-4 border-t border-wl-border pt-3 text-[10px] leading-relaxed text-wl-text-muted">
          Representative prototype references. Production deployment would link to authorized
          operator archives.
        </div>
      </div>
    </section>
  );
}

function Kv({ label, value, mono = false }) {
  return (
    <div>
      <div className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-wl-text-muted">
        {label}
      </div>
      <div className={`mt-0.5 text-[12.5px] text-wl-text-primary ${mono ? "tabular font-mono" : ""}`}>
        {value}
      </div>
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
