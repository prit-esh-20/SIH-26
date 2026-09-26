import { Users } from "lucide-react";
import SectionHeader from "../common/SectionHeader.jsx";
import { useWellContext } from "../../context/WellContext.jsx";
import {
  getComparableWells,
  getEventsForWell,
  getWell,
} from "../../data/mockData.js";

export default function ComparableWellsTable({ filters, selectedWellId, onSelect }) {
  const { activeWellId } = useWellContext();
  const well = getWell(activeWellId);

  const rows = getComparableWells(activeWellId)
    .filter((c) => {
      if (filters.query && !c.wellId.toLowerCase().includes(filters.query.toLowerCase())) return false;
      if (filters.formation !== "all" && c.formation !== filters.formation) return false;
      if (filters.distance !== "all" && c.distanceKm > Number(filters.distance)) return false;
      if (filters.similarity !== "all" && c.similarity < Number(filters.similarity)) return false;
      if (filters.depthScope === "relevant") {
        const d = well ? well.depth : 0;
        if (!c.relevantInterval || c.relevantInterval[1] < d) return false;
      }
      return true;
    })
    .sort((a, b) => b.similarity - a.similarity);

  const eventMatch = (c) =>
    filters.event === "all" ||
    getEventsForWell(c.wellId).some((e) => e.eventType === filters.event);

  return (
    <section className="wl-card flex flex-col">
      <SectionHeader
        icon={Users}
        title="Comparable Wells"
        actions={
          <span className="text-[10.5px] text-wl-text-muted">
            Ranked by combined geographic, geological, depth, operational and event similarity
          </span>
        }
      />
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[12px]">
          <thead>
            <tr className="border-b border-wl-border bg-wl-surface-2">
              <th className="wl-table-head px-4 py-2">Well</th>
              <th className="wl-table-head px-4 py-2">Distance</th>
              <th className="wl-table-head px-4 py-2">Formation</th>
              <th className="wl-table-head px-4 py-2">Depth</th>
              <th className="wl-table-head px-4 py-2">Similarity</th>
              <th className="wl-table-head px-4 py-2 text-right">Events</th>
              <th className="wl-table-head px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => {
              const w = getWell(c.wellId);
              const selected = c.wellId === selectedWellId;
              const matchesEvent = eventMatch(c);
              return (
                <tr
                  key={c.wellId}
                  onClick={() => onSelect(c.wellId)}
                  className={`cursor-pointer border-b border-wl-border/70 transition-colors duration-100 last:border-0 ${
                    selected
                      ? "bg-wl-accent-light"
                      : matchesEvent
                        ? "hover:bg-wl-accent-faint"
                        : "opacity-45 hover:bg-wl-surface-2"
                  }`}
                >
                  <td className="relative px-4 py-[7px]">
                    {selected && (
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-1/2 h-[16px] w-[3px] -translate-y-1/2 rounded-r-full bg-wl-accent"
                      />
                    )}
                    <span className="font-medium text-wl-text-primary">{c.wellId}</span>
                  </td>
                  <td className="tabular px-4 py-[7px] font-mono text-[12px]">
                    {c.distanceKm.toFixed(1)} km
                  </td>
                  <td className="px-4 py-[7px] text-wl-text-secondary">{c.formation}</td>
                  <td className="tabular px-4 py-[7px] font-mono text-[12px]">
                    {(w?.depth ?? 0).toLocaleString("en-IN")} m
                  </td>
                  <td className="px-4 py-[7px]">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-14 overflow-hidden rounded-[2px] bg-wl-surface-3">
                        <div
                          className="h-full rounded-[2px] bg-wl-accent"
                          style={{ width: `${c.similarity}%` }}
                        />
                      </div>
                      <span className="tabular font-mono text-[11.5px] text-wl-text-secondary">
                        {c.similarity}%
                      </span>
                    </div>
                  </td>
                  <td className="tabular px-4 py-[7px] text-right font-mono text-[12px]">
                    {c.events}
                  </td>
                  <td className="px-4 py-[7px] text-wl-text-secondary">{w?.status}</td>
                </tr>
              );
            })}
            {!rows.length && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-wl-text-muted">
                  No comparable wells match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="border-t border-wl-border px-4 py-2.5 text-[10px] leading-relaxed text-wl-text-muted">
        Representative similarity values. Nearby does not automatically mean comparable: relevance combines
        geography, geology, depth, operations and event overlap.
      </div>
    </section>
  );
}
