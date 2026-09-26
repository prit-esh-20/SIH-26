import { Map as MapIcon } from "lucide-react";
import SectionHeader from "../common/SectionHeader.jsx";
import { getWell } from "../../data/mockData.js";

export default function NearbyWellsTable({ wells, selectedWellId, onSelect }) {
  return (
    <section className="wl-card flex flex-col">
      <SectionHeader
        icon={MapIcon}
        title="Nearby / Comparable Wells"
        actions={
          <span className="text-[10.5px] text-wl-text-muted">
            Click a row to select
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
            {wells.map((c) => {
              const w = getWell(c.wellId);
              const selected = c.wellId === selectedWellId;
              return (
                <tr
                  key={c.wellId}
                  onClick={() => onSelect(c.wellId)}
                  className={`cursor-pointer border-b border-wl-border/70 transition-colors duration-100 last:border-0 ${
                    selected ? "bg-wl-accent-light" : "hover:bg-wl-accent-faint"
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
                  <td className="tabular px-4 py-[7px] font-mono text-[12px]">{c.distanceKm.toFixed(1)} km</td>
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
                  <td className="tabular px-4 py-[7px] text-right font-mono text-[12px]">{c.events}</td>
                  <td className="px-4 py-[7px] text-wl-text-secondary">{w?.status}</td>
                </tr>
              );
            })}
            {!wells.length && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-wl-text-muted">
                  No wells match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="border-t border-wl-border px-4 py-2.5 text-[10px] leading-relaxed text-wl-text-muted">
        Representative prototype data for Assam, India. Production deployment would use authorized operator datasets.
      </div>
    </section>
  );
}
