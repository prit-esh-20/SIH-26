import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";
import SectionHeader from "../common/SectionHeader.jsx";
import { getDocumentType } from "../../data/mockData.js";

export default function DocumentDetails({ document: doc, onViewDocument }) {
  const navigate = useNavigate();

  if (!doc) {
    return (
      <section className="wl-card flex flex-col">
        <SectionHeader icon={FileText} title="Selected Document" />
        <div className="flex flex-1 items-center justify-center px-6 py-10 text-[12px] text-wl-text-muted">
          Select a document in the table to view details.
        </div>
      </section>
    );
  }

  return (
    <section className="wl-card flex flex-col">
      <SectionHeader
        icon={FileText}
        title="Selected Document"
        actions={
          <span className="text-[10.5px] text-wl-text-muted">
            {doc.status} · {doc.date}
          </span>
        }
      />
      <div className="px-5 py-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="font-mono text-[16px] font-semibold tracking-wide text-wl-text-primary">
            {doc.documentId}
          </span>
          <span className="text-[12px] text-wl-text-secondary">{doc.type}</span>
        </div>

        <div className="mt-3.5 grid grid-cols-2 gap-x-6 gap-y-2.5 border-t border-wl-border pt-3.5">
          <Kv label="Well" value={doc.wellId} />
          <Kv label="Date" value={doc.date} mono />
          <Kv label="Formation" value={doc.formation} />
          <Kv label="Related Event" value={doc.eventType ?? "None"} />
          <Kv label="Depth" value={doc.depth ? `${doc.depth.toLocaleString("en-IN")} m` : "-"} mono />
          <Kv label="Page" value={String(doc.page)} mono />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="wl-btn wl-btn-primary" onClick={onViewDocument}>
            View Document
          </button>
          {doc.eventId && (
            <button type="button" className="wl-btn" onClick={() => navigate("/events")}>
              View Related Event
            </button>
          )}
          <button
            type="button"
            className="wl-btn"
            onClick={() => navigate("/wells/intelligence")}
            title="Opens the well in Well Intelligence"
          >
            View Well
          </button>
        </div>
      </div>
      <div className="border-t border-wl-border px-4 py-2.5 text-[10px] leading-relaxed text-wl-text-muted">
        Representative prototype reference for {getDocumentType(doc.documentId)} records. Production
        deployment would link to authorized operator archives.
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
