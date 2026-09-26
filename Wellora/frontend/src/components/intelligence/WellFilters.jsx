import { Search } from "lucide-react";
import { formations } from "../../data/mockData.js";

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

export default function WellFilters({ filters, onChange, eventTypes }) {
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value });

  return (
    <div className="wl-card px-4 py-3">
      <div className="flex flex-wrap items-end gap-x-4 gap-y-2.5">
        <Field label="Search Wells">
          <div className="relative">
            <Search
              size={12}
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-wl-text-muted"
            />
            <input
              type="text"
              value={filters.query}
              onChange={set("query")}
              placeholder="Search wells..."
              className={`${inputClass} w-[190px] pl-7`}
            />
          </div>
        </Field>

        <Field label="Formation">
          <select value={filters.formation} onChange={set("formation")} className={`${inputClass} w-[110px]`}>
            <option value="all">All formations</option>
            {Object.keys(formations).map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Distance">
          <select value={filters.distance} onChange={set("distance")} className={`${inputClass} w-[110px]`}>
            <option value="all">0 - 10 km</option>
            <option value="2">0 - 2 km</option>
            <option value="5">0 - 5 km</option>
          </select>
        </Field>

        <Field label="Similarity">
          <select value={filters.similarity} onChange={set("similarity")} className={`${inputClass} w-[110px]`}>
            <option value="all">All</option>
            <option value="80">80% and above</option>
            <option value="60">60% and above</option>
          </select>
        </Field>

        <Field label="Event">
          <select value={filters.event} onChange={set("event")} className={`${inputClass} w-[130px]`}>
            <option value="all">All events</option>
            {eventTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Depth Range">
          <select value={filters.depthScope} onChange={set("depthScope")} className={`${inputClass} w-[150px]`}>
            <option value="relevant">Current interval</option>
            <option value="all">Full well</option>
          </select>
        </Field>

        {(filters.query || filters.formation !== "all" || filters.distance !== "all" ||
          filters.similarity !== "all" || filters.event !== "all" || filters.depthScope !== "relevant") && (
          <button
            type="button"
            onClick={() =>
              onChange({
                query: "",
                formation: "all",
                distance: "all",
                similarity: "all",
                event: "all",
                depthScope: "relevant",
              })
            }
            className="wl-btn h-8"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
