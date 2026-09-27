import { GitCompare } from "lucide-react";
import SectionHeader from "../common/SectionHeader.jsx";
import { useWellContext } from "../../context/WellContext.jsx";
import { getEventById, getWell } from "../../data/mockData.js";

export default function SourceEvidenceMini({ document: doc }) {
  const { activeWellId } = useWellContext();
  const current = getWell(activeWellId);
  const event = doc?.eventId ? getEventById(doc.eventId) : null;

  if (!doc || !event) {
    return (
      <section className="wl-card flex flex-col">
        <SectionHeader icon={GitCompare} title="Source Evidence" />
        <div className="flex flex-1 items-center justify-center px-6 py-8 text-center text-[11.5px] leading-relaxed text-wl-text-muted">
          {doc
            ? "This document is a well-level record with no linked historical event."
            : "Select a document to see its event linkage."}
        </div>
      </section>
    );
  }

  const diff = event.depth - (current?.depth ?? 0);
  const absDiff = Math.abs(diff);

  return (
    <section className="wl-card flex flex-col">
      <SectionHeader
        icon={GitCompare}
        title="Source Evidence"
        actions={<span className="text-[10.5px] text-wl-text-muted">Event-linked record</span>}
      />
      <div className="px-5 py-4">
        <div className="flex items-center gap-2 text-[13px] font-semibold text-wl-text-primary">
          <span className="font-mono">{doc.documentId}</span>
          <span className="text-[10.5px] font-normal text-wl-text-muted">
            {doc.type} · Page {doc.page}
          </span>
        </div>

        <div className="mt-2.5 space-y-1 text-[11.5px]">
          <Row label="Related Event" value={`${event.eventType}, ${event.severity}`} />
          <Row label="Well" value={event.wellId} />
          <Row label="Depth" value={`${event.depth.toLocaleString("en-IN")} m`} mono />
          <Row label="Formation" value={event.formation} />
        </div>

        <div className="mt-3 border-t border-wl-border pt-2.5 text-[11px] leading-relaxed text-wl-text-secondary">
          {event.wellId === activeWellId
            ? "Event recorded on the current well."
            : `Recorded ${absDiff} m ${diff >= 0 ? "below" : "above"} the current bit depth on ${event.wellId}.`}
        </div>
      </div>
    </section>
  );
}

function Row({ label, value, mono = false }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-wl-text-muted">{label}</span>
      <span className={`text-wl-text-primary ${mono ? "tabular font-mono" : ""}`}>{value}</span>
    </div>
  );
}
