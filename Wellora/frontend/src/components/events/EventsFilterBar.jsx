import { Search } from "lucide-react";
import { getWell, wells } from "../../data/mockData.js";

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

const WELL_IDS = wells.map((w) => w.id);
const EVENT_TYPES = [...new Set(["Mud Loss", "Kick", "Tight Hole", "Stuck Pipe", "Bit Balling"])];
const DEPTH_RANGES = [
  { id: "2800-3000", label: "2,800 - 3,000 m", min: 2800, max: 3000 },
  { id: "3000-3200", label: "3,000 - 3,200 m", min: 3000, max: 3200 },
  { id: "3200-3600", label: "3,200 - 3,600 m", min: 3200, max: 3600 },
];

export const EMPTY_EVENT_FILTERS = {
  query: "",
  well: "all",
  type: "all",
  severity: "all",
  formation: "all",
  depth: "all",
};

export function applyEventFilters(events, filters) {
  return events.filter((e) => {
    if (filters.well !== "all" && e.wellId !== filters.well) return false;
    if (filters.type !== "all" && e.eventType !== filters.type) return false;
    if (filters.severity !== "all" && e.severity !== filters.severity) return false;
    if (filters.formation !== "all" && e.formation !== filters.formation) return false;
    if (filters.depth !== "all") {
      const range = DEPTH_RANGES.find((r) => r.id === filters.depth);
      if (range && (e.depth < range.min || e.depth > range.max)) return false;
    }
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const hay = `${e.eventType} ${e.wellId} ${e.depth} ${e.formation} ${e.mitigation} ${e.outcome}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export default function EventsFilterBar({ filters, onChange }) {
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value });
  const dirty = JSON.stringify(filters) !== JSON.stringify(EMPTY_EVENT_FILTERS);

  return (
    <div className="wl-card px-4 py-3">
      <div className="flex flex-wrap items-end gap-x-4 gap-y-2.5">
        <Field label="Search Events">
          <div className="relative">
            <Search
              size={12}
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-wl-text-muted"
            />
            <input
              type="text"
              value={filters.query}
              onChange={set("query")}
              placeholder="Search event, well, depth..."
              className={`${inputClass} w-[210px] pl-7`}
            />
          </div>
        </Field>

        <Field label="Well">
          <select value={filters.well} onChange={set("well")} className={`${inputClass} w-[110px]`}>
            <option value="all">All wells</option>
            {WELL_IDS.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Event Type">
          <select value={filters.type} onChange={set("type")} className={`${inputClass} w-[120px]`}>
            <option value="all">All events</option>
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Severity">
          <select value={filters.severity} onChange={set("severity")} className={`${inputClass} w-[120px]`}>
            <option value="all">All severity</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </Field>

        <Field label="Formation">
          <select value={filters.formation} onChange={set("formation")} className={`${inputClass} w-[120px]`}>
            <option value="all">All formations</option>
            <option value="F3">F3</option>
            <option value="F4">F4</option>
            <option value="F5">F5</option>
          </select>
        </Field>

        <Field label="Depth Range">
          <select value={filters.depth} onChange={set("depth")} className={`${inputClass} w-[140px]`}>
            <option value="all">All depths</option>
            {DEPTH_RANGES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </Field>

        {dirty && (
          <button type="button" className="wl-btn h-8" onClick={() => onChange(EMPTY_EVENT_FILTERS)}>
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
