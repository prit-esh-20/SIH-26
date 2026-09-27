import { FileBarChart, Download } from "lucide-react";
import SectionHeader from "../common/SectionHeader.jsx";

const COLUMNS = [
  { key: "title", label: "Report" },
  { key: "type", label: "Type" },
  { key: "wellId", label: "Well" },
  { key: "generated", label: "Generated", mono: true },
  { key: "depth", label: "Depth", mono: true },
  { key: "formation", label: "Formation" },
  { key: "status", label: "Status" },
];

export default function ReportsTable({ reports, total, selectedId, onSelect }) {
  return (
    <section className="wl-card flex flex-col">
      <SectionHeader
        icon={FileBarChart}
        title="Report Library"
        actions={
          <span className="text-[10.5px] text-wl-text-muted">
            {reports.length} of {total} reports · click a row for details
          </span>
        }
      />
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[12px]">
          <thead>
            <tr className="border-b border-wl-border bg-wl-surface-2">
              {COLUMNS.map((c) => (
                <th key={c.key} className="wl-table-head px-4 py-2">
                  {c.label}
                </th>
              ))}
              <th className="wl-table-head px-4 py-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => {
              const selected = r.id === selectedId;
              return (
                <tr
                  key={r.id}
                  onClick={() => onSelect(r.id)}
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
                    <span className="text-[12px] font-medium text-wl-text-primary">{r.title}</span>
                  </td>
                  <td className="px-4 py-[7px] text-wl-text-secondary">{r.type}</td>
                  <td className="px-4 py-[7px] text-wl-text-secondary">{r.wellId}</td>
                  <td className="tabular font-mono px-4 py-[7px] text-wl-text-secondary">{r.generated}</td>
                  <td className="tabular font-mono px-4 py-[7px] text-wl-text-secondary">
                    {r.depth.toLocaleString("en-IN")} m
                  </td>
                  <td className="px-4 py-[7px] text-wl-text-secondary">{r.formation}</td>
                  <td className="px-4 py-[7px]">
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-wl-text-secondary">
                      <span
                        className="inline-block h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: r.status === "Ready" ? "#3f7d55" : "#B97800" }}
                      />
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-[7px] text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(r.id, true);
                      }}
                      className="wl-btn !px-2.5 !py-1 !text-[10px]"
                      title="View report preview"
                    >
                      <Download size={10} className="rotate-180" />
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
            {!reports.length && (
              <tr>
                <td colSpan={COLUMNS.length + 1} className="px-4 py-10 text-center text-wl-text-muted">
                  No reports match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
