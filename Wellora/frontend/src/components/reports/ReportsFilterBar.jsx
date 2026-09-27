import { Search } from "lucide-react";
import { getReports, wells } from "../../data/mockData.js";

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

export const EMPTY_REPORT_FILTERS = {
  query: "",
  well: "all",
  type: "all",
  date: "all",
  status: "all",
};

export function applyReportFilters(list, filters) {
  return list.filter((r) => {
    if (filters.well !== "all" && r.wellId !== filters.well) return false;
    if (filters.type !== "all" && r.type !== filters.type) return false;
    if (filters.status !== "all" && r.status !== filters.status) return false;
    if (filters.date !== "all") {
      if (filters.date === "2026-09-27" && r.generated !== "2026-09-27") return false;
      if (filters.date === "2026-09-26" && r.generated !== "2026-09-26") return false;
      if (filters.date === "2026-09-25" && r.generated !== "2026-09-25") return false;
    }
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const hay = `${r.title} ${r.type} ${r.wellId} ${r.generated} ${r.status}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export default function ReportsFilterBar({ filters, onChange, onGenerate }) {
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value });
  const dirty = JSON.stringify(filters) !== JSON.stringify(EMPTY_REPORT_FILTERS);
  const types = [...new Set(getReports().map((r) => r.type))].sort();
  const dates = [...new Set(getReports().map((r) => r.generated))].sort().reverse();

  return (
    <div className="wl-card px-4 py-3">
      <div className="flex flex-wrap items-end gap-x-4 gap-y-2.5">
        <Field label="Search Reports">
          <div className="relative">
            <Search
              size={12}
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-wl-text-muted"
            />
            <input
              type="text"
              value={filters.query}
              onChange={set("query")}
              placeholder="Search reports, wells, events..."
              className={`${inputClass} w-[210px] pl-7`}
            />
          </div>
        </Field>

        <Field label="Well">
          <select value={filters.well} onChange={set("well")} className={`${inputClass} w-[110px]`}>
            <option value="all">All wells</option>
            {wells.map((w) => (
              <option key={w.id} value={w.id}>
                {w.id}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Report Type">
          <select value={filters.type} onChange={set("type")} className={`${inputClass} w-[190px]`}>
            <option value="all">All reports</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Date">
          <select value={filters.date} onChange={set("date")} className={`${inputClass} w-[120px]`}>
            <option value="all">All dates</option>
            {dates.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Status">
          <select value={filters.status} onChange={set("status")} className={`${inputClass} w-[120px]`}>
            <option value="all">All reports</option>
            <option value="Ready">Ready</option>
            <option value="Generating">Generating</option>
            <option value="Archived">Archived</option>
          </select>
        </Field>

        {dirty && (
          <button type="button" className="wl-btn h-8" onClick={() => onChange(EMPTY_REPORT_FILTERS)}>
            Clear Filters
          </button>
        )}

        <button type="button" className="wl-btn wl-btn-primary ml-auto h-8" onClick={onGenerate}>
          Generate Report
        </button>
      </div>
    </div>
  );
}
