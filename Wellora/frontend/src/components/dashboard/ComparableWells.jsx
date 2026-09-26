import { Users } from "lucide-react";
import SectionHeader from "../common/SectionHeader.jsx";
import { useWellContext } from "../../context/WellContext.jsx";
import { getComparableWells, getWell } from "../../data/mockData.js";

const SIMILARITY_COLOR = (s) =>
  s >= 80 ? "#6fa07a" : s >= 60 ? "#d99a2b" : "#8d969b";

export default function ComparableWells() {
  const { activeWellId } = useWellContext();
  const wells = getComparableWells(activeWellId).sort((a, b) => b.similarity - a.similarity);

  return (
    <section className="wl-card flex flex-col">
      <SectionHeader
        icon={Users}
        title="Comparable Wells"
        actions={
          <span className="text-[10.5px] text-wl-text-muted">
            Combined similarity index, representative
          </span>
        }
      />
      <table className="w-full border-collapse text-[12px]">
        <thead>
          <tr className="border-b border-wl-border bg-wl-surface-2">
            <th className="wl-table-head px-4 py-2">Well</th>
            <th className="wl-table-head px-4 py-2">Distance</th>
            <th className="wl-table-head px-4 py-2">Formation</th>
            <th className="wl-table-head px-4 py-2">Similarity</th>
            <th className="wl-table-head px-4 py-2 text-right">Events</th>
          </tr>
        </thead>
        <tbody>
          {wells.map((c) => {
            const w = getWell(c.wellId);
            return (
              <tr
                key={c.wellId}
                className="border-b border-wl-border/50 transition-colors duration-100 last:border-0 hover:bg-wl-surface-2"
                title={w ? `${w.status} at ${w.depth.toLocaleString("en-IN")} m` : undefined}
              >
                <td className="px-4 py-[7px] font-medium text-wl-text-primary">{c.wellId}</td>
                <td className="tabular px-4 py-[7px] font-mono text-[12px]">
                  {c.distanceKm.toFixed(1)} km
                </td>
                <td className="px-4 py-[7px] text-wl-text-secondary">{c.formation}</td>
                <td className="px-4 py-[7px]">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-14 overflow-hidden rounded-[2px] bg-wl-surface-3">
                      <div
                        className="h-full rounded-[2px]"
                        style={{
                          width: `${c.similarity}%`,
                          backgroundColor: SIMILARITY_COLOR(c.similarity),
                        }}
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
              </tr>
            );
          })}
          {!wells.length && (
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-wl-text-muted">
                No comparable wells for the active well.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="border-t border-wl-border px-4 py-2.5 text-[10px] leading-relaxed text-wl-text-muted">
        Similarity combines geographic, geological, depth, operational and event overlap. Representative values.
      </div>
    </section>
  );
}
