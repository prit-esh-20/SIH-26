import { Wrench } from "lucide-react";
import SectionHeader from "../common/SectionHeader.jsx";
import { getWell } from "../../data/mockData.js";

export default function MitigationPanel({ selectedEvent }) {
  const well = selectedEvent ? getWell(selectedEvent.wellId) : null;

  return (
    <section className="wl-card flex flex-col">
      <SectionHeader
        icon={Wrench}
        title="Historical Mitigation"
        actions={
          <span className="text-[10.5px] text-wl-text-muted">
            {selectedEvent ? `Historical response used in ${selectedEvent.wellId}` : ""}
          </span>
        }
      />
      {selectedEvent ? (
        <div className="grid flex-1 grid-cols-1 gap-x-8 gap-y-3 px-5 py-4 sm:grid-cols-2">
          <MitigationField label="Event" value={`${selectedEvent.eventType}, ${selectedEvent.severity} severity`} />
          <MitigationField label="Well" value={`${selectedEvent.wellId}${well ? `, ${well.status.toLowerCase()}` : ""}`} />
          <MitigationField label="What Happened" value={selectedEvent.whatHappened ?? "-"} />
          <MitigationField label="Mitigation Used" value={selectedEvent.mitigation} />
          <MitigationField label="Operational Response" value={selectedEvent.operationalResponse ?? "-"} />
          <MitigationField label="Outcome" value={selectedEvent.outcome} />
          <MitigationField label="NPT" value={`${selectedEvent.nptHours.toFixed(1)} hours`} />
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center px-6 py-8 text-[12px] text-wl-text-muted">
          Select an event to review the historical mitigation.
        </div>
      )}
      <div className="border-t border-wl-border px-4 py-2.5 text-[10px] leading-relaxed text-wl-text-muted">
        Recorded historical response, not a prescription. Review with the drilling team before acting.
      </div>
    </section>
  );
}

function MitigationField({ label, value }) {
  return (
    <div className="border-b border-wl-border/60 pb-2">
      <div className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-wl-text-muted">
        {label}
      </div>
      <div className="mt-0.5 text-[12.5px] leading-relaxed text-wl-text-primary">{value}</div>
    </div>
  );
}
