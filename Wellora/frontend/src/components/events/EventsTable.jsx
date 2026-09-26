import { Database, ArrowDown, ArrowUp } from "lucide-react";
import SectionHeader from "../common/SectionHeader.jsx";
import SeverityChip from "../common/SeverityChip.jsx";

const COLUMNS = [
  { key: "depth", label: "Depth", align: "left" },
  { key: "eventType", label: "Event", align: "left" },
  { key: "wellId", label: "Well", align: "left" },
  { key: "formation", label: "Formation", align: "left" },
  { key: "severity", label: "Severity", align: "left" },
  { key: "nptHours", label: "NPT", align: "right" },
  { key: "mitigation", label: "Mitigation", align: "left" },
  { key: "outcome", label: "Outcome", align: "left" },
];

export default function EventsTable({ events, total, selectedEventId, onSelect, sort, onSortChange }) {
  const toggleSort = (key) => {
    if (sort.key === key) {
      onSortChange({ key, dir: sort.dir === "asc" ? "desc" : "asc" });
    } else {
      onSortChange({ key, dir: key === "depth" || key === "nptHours" ? "desc" : "asc" });
    }
  };

  return (
    <section className="wl-card flex flex-col">
      <SectionHeader
        icon={Database}
        title="Event Table"
        actions={
          <span className="text-[10.5px] text-wl-text-muted">
            {events.length} of {total} events · click a row for details
          </span>
        }
      />
      <div className="max-h-[560px] overflow-auto">
        <table className="w-full border-collapse text-[12px]">
          <thead className="sticky top-0 z-10">
            <tr className="border-b border-wl-border bg-wl-surface-2">
              {COLUMNS.map((c) => {
                const active = sort.key === c.key;
                return (
                  <th
                    key={c.key}
                    className={`wl-table-head cursor-pointer select-none px-4 py-2 transition-colors duration-100 hover:text-wl-text-primary ${c.align === "right" ? "text-right" : ""}`}
                    onClick={() => toggleSort(c.key)}
                    title={`Sort by ${c.label}`}
                  >
                    <span className={`inline-flex items-center gap-1 ${c.align === "right" ? "flex-row-reverse" : ""}`}>
                      {c.label}
                      {active ? (
                        sort.dir === "asc" ? (
                          <ArrowUp size={10} className="text-wl-accent-dark" />
                        ) : (
                          <ArrowDown size={10} className="text-wl-accent-dark" />
                        )
                      ) : null}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {events.map((e) => {
              const selected = e.id === selectedEventId;
              return (
                <tr
                  key={e.id}
                  onClick={() => onSelect(e.id)}
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
                    <span className="tabular font-mono text-[12px] text-wl-text-primary">
                      {e.depth.toLocaleString("en-IN")} m
                    </span>
                  </td>
                  <td className="px-4 py-[7px] font-medium text-wl-text-primary">{e.eventType}</td>
                  <td className="px-4 py-[7px] text-wl-text-secondary">{e.wellId}</td>
                  <td className="px-4 py-[7px] text-wl-text-secondary">{e.formation}</td>
                  <td className="px-4 py-[7px]">
                    <SeverityChip severity={e.severity} />
                  </td>
                  <td className="tabular px-4 py-[7px] text-right font-mono text-[12px] text-wl-text-primary">
                    {e.nptHours.toFixed(1)} h
                  </td>
                  <td className="max-w-[220px] truncate px-4 py-[7px] text-wl-text-secondary" title={e.mitigation}>
                    {e.mitigation}
                  </td>
                  <td className="max-w-[240px] truncate px-4 py-[7px] text-wl-text-secondary" title={e.outcome}>
                    {e.outcome}
                  </td>
                </tr>
              );
            })}
            {!events.length && (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-10 text-center text-wl-text-muted">
                  No events match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
