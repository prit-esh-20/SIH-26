import { Search } from "lucide-react";
import { getAllAlerts, wells } from "../../data/mockData.js";

const inputClass =
  "h-8 max-w-full rounded-[5px] border border-wl-border bg-wl-surface px-2.5 text-[12px] text-wl-text-primary transition-colors duration-100 focus:border-wl-accent";

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

const ALERT_WELLS = [...new Set(getAllAlerts().map((a) => a.wellId))];
const ALERT_TYPES = [...new Set(getAllAlerts().map((a) => a.riskType))].sort();
const ALERT_FORMATIONS = [...new Set(getAllAlerts().map((a) => a.formation))].sort();
const ALERT_WELL = wells.find((w) => w.id === ALERT_WELLS[0]) ?? wells[0];
const CURRENT_INTERVAL_END = ALERT_WELL ? ALERT_WELL.depth + 90 : 2950;

export const EMPTY_ALERT_FILTERS = {
  query: "",
  well: "all",
  severity: "all",
  type: "all",
  formation: "all",
  status: "active",
  depth: "current",
};

export function applyAlertsFilters(alerts, filters) {
  return alerts.filter((a) => {
    if (filters.well !== "all" && a.wellId !== filters.well) return false;
    if (filters.severity !== "all" && a.severity !== filters.severity) return false;
    if (filters.type !== "all" && a.riskType !== filters.type) return false;
    if (filters.formation !== "all" && a.formation !== filters.formation) return false;
    if (filters.status !== "all") {
      if (filters.status === "active") {
        if (a.status === "Reviewed") return false;
      } else if (a.status !== filters.status) {
        return false;
      }
    }
    if (filters.depth !== "all") {
      if (filters.depth === "current") {
        const overlaps =
          a.riskInterval[0] <= CURRENT_INTERVAL_END &&
          a.riskInterval[1] >= (ALERT_WELL?.depth ?? 0);
        if (!overlaps) return false;
      } else if (filters.depth === "deep") {
        if (a.riskInterval[0] < 3000) return false;
      }
    }
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const hay =
        `${a.riskType} ${a.wellId} ${a.severity} ${a.formation} ${a.status} ${a.riskInterval[0]} ${a.riskInterval[1]} ${a.distanceToRiskM}m`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export default function AlertsFilterBar({ filters, onChange }) {
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value });
  const dirty = JSON.stringify(filters) !== JSON.stringify(EMPTY_ALERT_FILTERS);

  return (
    <div className="wl-card px-4 py-3">
      <div className="flex flex-wrap items-end gap-x-4 gap-y-2.5">
        <Field label="Search Alerts">
          <div className="relative">
            <Search
              size={12}
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-wl-text-muted"
            />
            <input
              type="text"
              value={filters.query}
              onChange={set("query")}
              placeholder="Search alerts, wells, events..."
              className={`${inputClass} w-[210px] pl-7`}
            />
          </div>
        </Field>

        <Field label="Well">
          <select value={filters.well} onChange={set("well")} className={`${inputClass} w-[110px]`}>
            <option value="all">All wells</option>
            {ALERT_WELLS.map((id) => (
              <option key={id} value={id}>
                {id}
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

        <Field label="Alert Type">
          <select value={filters.type} onChange={set("type")} className={`${inputClass} w-[130px]`}>
            <option value="all">All alert types</option>
            {ALERT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Formation">
          <select value={filters.formation} onChange={set("formation")} className={`${inputClass} w-[120px]`}>
            <option value="all">All formations</option>
            {ALERT_FORMATIONS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Status">
          <select value={filters.status} onChange={set("status")} className={`${inputClass} w-[120px]`}>
            <option value="active">Active</option>
            <option value="all">All statuses</option>
            <option value="Approaching">Approaching</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Reviewed">Reviewed</option>
          </select>
        </Field>

        <Field label="Depth Range">
          <select value={filters.depth} onChange={set("depth")} className={`${inputClass} w-[190px]`}>
            <option value="current">
              Current interval ({ALERT_WELL?.depth.toLocaleString("en-IN")} -{" "}
              {CURRENT_INTERVAL_END.toLocaleString("en-IN")} m)
            </option>
            <option value="all">All depths</option>
            <option value="deep">3,000 m and deeper</option>
          </select>
        </Field>

        {dirty && (
          <button type="button" className="wl-btn h-8" onClick={() => onChange(EMPTY_ALERT_FILTERS)}>
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
