import { FileText } from "lucide-react";
import SectionHeader from "../common/SectionHeader.jsx";
import { getDocumentType } from "../../data/mockData.js";

export default function SourceEvidenceCard({ selectedEvent, onViewEvidence }) {
  return (
    <section className="wl-card flex flex-col">
      <SectionHeader icon={FileText} title="Source Evidence" />
      {selectedEvent ? (
        <div className="flex flex-1 flex-col px-5 py-4">
          <div className="flex items-center gap-2 text-[15px] font-semibold text-wl-text-primary">
            <FileText size={14} className="text-wl-text-secondary" />
            {selectedEvent.document}
          </div>
          <div className="mt-0.5 text-[11.5px] text-wl-text-muted">
            {getDocumentType(selectedEvent.document)} · Page {selectedEvent.page}
          </div>

          <div className="mt-3 space-y-1.5 border-t border-wl-border pt-3 text-[11.5px]">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-wl-text-muted">Event</span>
              <span className="font-medium text-wl-text-primary">{selectedEvent.eventType}</span>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-wl-text-muted">Depth</span>
              <span className="tabular font-mono text-wl-text-primary">
                {selectedEvent.depth.toLocaleString("en-IN")} m
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-wl-text-muted">Formation</span>
              <span className="text-wl-text-primary">{selectedEvent.formation}</span>
            </div>
          </div>

          <button
            type="button"
            className="wl-btn wl-btn-primary mt-4 self-start"
            onClick={onViewEvidence}
          >
            <FileText size={12} />
            View Evidence
          </button>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center px-6 py-8 text-[12px] text-wl-text-muted">
          Select an event to view its source reference.
        </div>
      )}
    </section>
  );
}
