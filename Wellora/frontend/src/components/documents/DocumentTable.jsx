import { FileText, ArrowDown, ArrowUp } from "lucide-react";
import SectionHeader from "../common/SectionHeader.jsx";

const COLUMNS = [
  { key: "documentId", label: "Document", align: "left" },
  { key: "type", label: "Type", align: "left" },
  { key: "wellId", label: "Well", align: "left" },
  { key: "date", label: "Date", align: "left" },
  { key: "formation", label: "Formation", align: "left" },
  { key: "eventType", label: "Related Event", align: "left" },
  { key: "status", label: "Status", align: "left" },
];

export default function DocumentTable({ documents, total, selectedId, onSelect, sort, onSortChange }) {
  const toggleSort = (key) => {
    if (sort.key === key) {
      onSortChange({ key, dir: sort.dir === "asc" ? "desc" : "asc" });
    } else {
      onSortChange({ key, dir: key === "date" || key === "documentId" ? "desc" : "asc" });
    }
  };

  return (
    <section className="wl-card flex flex-col">
      <SectionHeader
        icon={FileText}
        title="Document Library"
        actions={
          <span className="text-[10.5px] text-wl-text-muted">
            {documents.length} of {total} documents · click a row for details
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
            {documents.map((d) => {
              const selected = d.id === selectedId;
              return (
                <tr
                  key={d.id}
                  onClick={() => onSelect(d.id)}
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
                    <span className="font-mono text-[12px] font-medium text-wl-text-primary">
                      {d.documentId}
                    </span>
                    <span className="ml-2 text-[10px] text-wl-text-muted">p.{d.page}</span>
                  </td>
                  <td className="px-4 py-[7px] text-wl-text-secondary">{d.type}</td>
                  <td className="px-4 py-[7px] text-wl-text-secondary">{d.wellId}</td>
                  <td className="tabular font-mono px-4 py-[7px] text-wl-text-secondary">{d.date}</td>
                  <td className="px-4 py-[7px] text-wl-text-secondary">{d.formation}</td>
                  <td className="px-4 py-[7px] text-wl-text-secondary">
                    {d.eventType ?? <span className="text-wl-text-muted">-</span>}
                  </td>
                  <td className="px-4 py-[7px]">
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-wl-text-secondary">
                      <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "#3f7d55" }} />
                      {d.status}
                    </span>
                  </td>
                </tr>
              );
            })}
            {!documents.length && (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-10 text-center text-wl-text-muted">
                  No documents match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
