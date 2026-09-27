import { useMemo } from "react";
import { Search } from "lucide-react";
import { documentLibrary } from "../../data/mockData.js";

const inputClass =
  "h-8 rounded-[5px] border border-wl-border bg-wl-surface px-2.5 text-[12px] text-wl-text-primary transition-colors duration-100 focus:border-wl-accent";

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-wl-text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

export const EMPTY_DOCUMENT_FILTERS = {
  query: "",
  well: "all",
  type: "all",
  event: "all",
  formation: "all",
  date: "all",
};

export function applyDocumentFilters(docs, filters) {
  return docs.filter((d) => {
    if (filters.well !== "all" && d.wellId !== filters.well) return false;
    if (filters.type !== "all" && d.type !== filters.type) return false;
    if (filters.event !== "all") {
      if (filters.event === "none") {
        if (d.eventType) return false;
      } else if (d.eventType !== filters.event) {
        return false;
      }
    }
    if (filters.formation !== "all" && d.formation !== filters.formation) return false;
    if (filters.date !== "all") {
      if (filters.date === "2026" && !d.date.startsWith("2026")) return false;
      if (filters.date === "2025" && !d.date.startsWith("2025")) return false;
    }
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const hay =
        `${d.documentId} ${d.id} ${d.type} ${d.wellId} ${d.eventType ?? ""} ${d.formation} ${d.depth} ${d.date}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export default function DocumentFilters({ filters, onChange }) {
  const options = useMemo(() => {
    const wells = [...new Set(documentLibrary.map((d) => d.wellId))].sort();
    const types = [...new Set(documentLibrary.map((d) => d.type))].sort();
    const events = [...new Set(documentLibrary.map((d) => d.eventType).filter(Boolean))].sort();
    const formations = [...new Set(documentLibrary.map((d) => d.formation))].sort();
    return { wells, types, events, formations };
  }, []);

  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value });
  const dirty = JSON.stringify(filters) !== JSON.stringify(EMPTY_DOCUMENT_FILTERS);

  return (
    <div className="wl-card px-4 py-3">
      <div className="flex flex-wrap items-end gap-x-4 gap-y-2.5">
        <Field label="Search Documents">
          <div className="relative">
            <Search
              size={12}
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-wl-text-muted"
            />
            <input
              type="text"
              value={filters.query}
              onChange={set("query")}
              placeholder="Search documents, wells, events..."
              className={`${inputClass} w-[220px] pl-7`}
            />
          </div>
        </Field>

        <Field label="Well">
          <select value={filters.well} onChange={set("well")} className={`${inputClass} w-[110px]`}>
            <option value="all">All wells</option>
            {options.wells.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Document Type">
          <select value={filters.type} onChange={set("type")} className={`${inputClass} w-[170px]`}>
            <option value="all">All documents</option>
            {options.types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Event">
          <select value={filters.event} onChange={set("event")} className={`${inputClass} w-[120px]`}>
            <option value="all">All events</option>
            {options.events.map((ev) => (
              <option key={ev} value={ev}>
                {ev}
              </option>
            ))}
            <option value="none">No linked event</option>
          </select>
        </Field>

        <Field label="Formation">
          <select value={filters.formation} onChange={set("formation")} className={`${inputClass} w-[120px]`}>
            <option value="all">All formations</option>
            {options.formations.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Date">
          <select value={filters.date} onChange={set("date")} className={`${inputClass} w-[110px]`}>
            <option value="all">All dates</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
        </Field>

        {dirty && (
          <button type="button" className="wl-btn h-8" onClick={() => onChange(EMPTY_DOCUMENT_FILTERS)}>
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
