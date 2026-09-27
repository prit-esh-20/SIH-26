import { Database } from "lucide-react";
import { useMemo, useState } from "react";
import SectionHeader from "../common/SectionHeader.jsx";
import SeverityChip from "../common/SeverityChip.jsx";
import EventDetailDrawer from "../common/EventDetailDrawer.jsx";
import { useWellContext } from "../../context/WellContext.jsx";
import { getComparableWells, historicalEvents } from "../../data/mockData.js";

export default function HistoricalEvents() {
  const { activeWellId } = useWellContext();
  const [selectedEvent, setSelectedEvent] = useState(null);

  const events = useMemo(() => {
    const nearby = getComparableWells(activeWellId)
      .filter((c) => c.wellId !== activeWellId)
      .map((c) => c.wellId);
    return historicalEvents
      .filter((e) => nearby.includes(e.wellId))
      .sort((a, b) => a.depth - b.depth);
  }, [activeWellId]);

  return (
    <section className="wl-card flex flex-col">
      <SectionHeader
        icon={Database}
        title="Historical Events, Nearby Wells"
        actions={
          <span className="text-[10.5px] text-wl-text-muted">
            {events.length} events within comparable offsets
          </span>
        }
      />
      <div className="max-h-[280px] overflow-y-auto">
        <table className="w-full border-collapse text-[12px]">
          <thead className="sticky top-0 z-10 bg-wl-surface-2">
            <tr className="border-b border-wl-border">
              <th className="wl-table-head px-4 py-2">Depth</th>
              <th className="wl-table-head px-4 py-2">Event</th>
              <th className="wl-table-head px-4 py-2">Well</th>
              <th className="wl-table-head px-4 py-2">Formation</th>
              <th className="wl-table-head px-4 py-2">Severity</th>
              <th className="wl-table-head px-4 py-2 text-right">NPT</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr
                key={e.id}
                onClick={() => setSelectedEvent(e)}
                className="cursor-pointer border-b border-wl-border/70 transition-colors duration-100 last:border-0 hover:bg-wl-accent-faint"
              >
                <td className="tabular px-4 py-[7px] font-mono text-[12px]">
                  {e.depth.toLocaleString("en-IN")} m
                </td>
                <td className="px-4 py-[7px] font-medium text-wl-text-primary">{e.eventType}</td>
                <td className="px-4 py-[7px] text-wl-text-secondary">{e.wellId}</td>
                <td className="px-4 py-[7px] text-wl-text-secondary">{e.formation}</td>
                <td className="px-4 py-[7px]">
                  <SeverityChip severity={e.severity} />
                </td>
                <td className="tabular px-4 py-[7px] text-right font-mono text-[12px]">
                  {e.nptHours.toFixed(1)} h
                </td>
              </tr>
            ))}
            {!events.length && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-wl-text-muted">
                  No historical events recorded for nearby wells.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <EventDetailDrawer event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </section>
  );
}
