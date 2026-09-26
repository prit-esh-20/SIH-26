import { FileText } from "lucide-react";
import SectionHeader from "../common/SectionHeader.jsx";
import SeverityChip from "../common/SeverityChip.jsx";
import { getDocumentType } from "../../data/mockData.js";

export default function EventDetailPanel({ event }) {
  if (!event) {
    return (
      <section className="wl-card flex flex-col">
        <SectionHeader icon={FileText} title="Event Details" />
        <div className="flex flex-1 items-center justify-center px-6 py-10 text-[12px] text-wl-text-muted">
          Select an event in the table to view details.
        </div>
      </section>
    );
  }

  return (
    <section className="wl-card flex flex-col">
      <SectionHeader
        icon={FileText}
        title="Event Details"
        actions={
          <span className="text-[10.5px] text-wl-text-muted">
            {event.document} · Page {event.page}
          </span>
        }
      />
      <div className="px-5 py-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <span className="text-[17px] font-semibold tracking-wide text-wl-text-primary">
            {event.eventType}
          </span>
          <SeverityChip severity={event.severity} />
          <span className="tabular font-mono text-[12.5px] text-wl-text-secondary">
            {event.depth.toLocaleString("en-IN")} m · {event.formation}
          </span>
          <span className="ml-auto text-[11px] text-wl-text-muted">
            {event.wellId} · {event.date}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 border-t border-wl-border pt-3.5 sm:grid-cols-2">
          <Field label="What Happened" value={event.whatHappened ?? "-"} />
          <Field label="Mitigation Used" value={event.mitigation} />
          <Field label="Operational Response" value={event.operationalResponse ?? "-"} />
          <Field label="Outcome" value={event.outcome} />
          <Field label="NPT" value={`${event.nptHours.toFixed(1)} hours`} mono />
          <Field label="Source" value={`${event.document}, page ${event.page} (${getDocumentType(event.document)})`} />
        </div>
      </div>
      <div className="border-t border-wl-border px-4 py-2.5 text-[10px] leading-relaxed text-wl-text-muted">
        Historical record from the representative dataset. Not a prediction of current well behaviour.
      </div>
    </section>
  );
}

function Field({ label, value, mono = false }) {
  return (
    <div className="border-b border-wl-border/60 pb-2">
      <div className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-wl-text-muted">
        {label}
      </div>
      <div className={`mt-0.5 text-[12.5px] leading-relaxed text-wl-text-primary ${mono ? "tabular font-mono" : ""}`}>
        {value}
      </div>
    </div>
  );
}
