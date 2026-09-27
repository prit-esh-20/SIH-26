import { FileText } from "lucide-react";
import SectionHeader from "../common/SectionHeader.jsx";

export default function DocumentPreview({ document: doc, onView }) {
  if (!doc) return null;

  return (
    <section className="wl-card flex flex-col">
      <SectionHeader
        icon={FileText}
        title="Document Preview"
        actions={
          <span className="text-[9.5px] uppercase tracking-[0.08em] text-wl-text-muted">
            Prototype document preview
          </span>
        }
      />
      <div className="px-5 py-4">
        <div className="rounded-[5px] border border-wl-border bg-wl-surface-2 px-5 py-4">
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-wl-text-muted">
            {doc.type}
          </div>
          <div className="mt-1 flex items-center gap-2.5">
            <span className="font-mono text-[15px] font-semibold text-wl-text-primary">
              {doc.documentId}
            </span>
            <span className="text-[10.5px] text-wl-text-muted">Page {doc.page}</span>
          </div>

          <div className="mt-3.5 space-y-1.5 border-t border-wl-border pt-3 text-[12px]">
            <Row label="Well" value={doc.wellId} />
            <Row label="Date" value={doc.date} mono />
            <Row label="Formation" value={doc.formation} />
            <Row label="Depth" value={doc.depth ? `${doc.depth.toLocaleString("en-IN")} m` : "-"} mono />
            {doc.eventType && <Row label="Event" value={doc.eventType} />}
            <Row label="Status" value={doc.status} />
          </div>

          <blockquote className="mt-3.5 rounded-[4px] border border-wl-border bg-wl-surface px-4 py-3 text-[11.5px] leading-relaxed text-wl-text-secondary">
            Representative source reference. The document viewer with original report pages is
            planned for the backend integration phase.
          </blockquote>
        </div>

        {onView && (
          <button type="button" className="wl-btn wl-btn-primary mt-3" onClick={onView}>
            View Document
          </button>
        )}
      </div>
    </section>
  );
}

function Row({ label, value, mono = false }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-wl-text-muted">
        {label}
      </span>
      <span className={`text-wl-text-primary ${mono ? "tabular font-mono" : ""}`}>{value}</span>
    </div>
  );
}
