import { Search } from "lucide-react";

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

const EVENT_TYPES = ["Mud Loss", "Stuck Pipe", "Kick", "Tight Hole", "Bit Balling"];

export default function MapControls({ filters, onChange }) {
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value });
  const setRadius = (v) => onChange({ ...filters, radius: v });
  const setLayer = (key) => (e) =>
    onChange({ ...filters, layers: { ...filters.layers, [key]: e.target.checked } });

  return (
    <div className="wl-card px-4 py-3">
      <div className="flex flex-wrap items-end gap-x-4 gap-y-2.5">
        <Field label="Current Well">
          <div className="flex h-8 items-center rounded-[5px] border border-wl-border bg-wl-surface-2 px-2.5 text-[12px] font-semibold text-wl-accent-dark">
            W-205
          </div>
        </Field>

        <Field label="Search">
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
              className={`${inputClass} w-[160px] pl-7`}
            />
          </div>
        </Field>

        <Field label="Radius">
          <div className="flex h-8 items-center gap-1 rounded-[5px] border border-wl-border bg-wl-surface px-1">
            {[5, 10, 25].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRadius(r)}
                className={`h-6 rounded-[4px] px-2 text-[11.5px] font-medium transition-colors duration-100 ${
                  filters.radius === r
                    ? "bg-wl-accent text-white"
                    : "text-wl-text-secondary hover:bg-wl-surface-2"
                }`}
              >
                {r} km
              </button>
            ))}
          </div>
        </Field>

        <Field label="Formation">
          <select value={filters.formation} onChange={set("formation")} className={`${inputClass} w-[120px]`}>
            <option value="all">All formations</option>
            <option value="F3">F3</option>
            <option value="F4">F4</option>
            <option value="F5">F5</option>
          </select>
        </Field>

        <Field label="Event Type">
          <select value={filters.event} onChange={set("event")} className={`${inputClass} w-[130px]`}>
            <option value="all">All events</option>
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Map Layers">
          <div className="flex h-8 items-center gap-3 rounded-[5px] border border-wl-border bg-wl-surface px-2.5">
            <Check label="Wells" checked={filters.layers.wells} onChange={setLayer("wells")} />
            <Check label="Events" checked={filters.layers.events} onChange={setLayer("events")} />
            <Check label="Density" checked={filters.layers.density} onChange={setLayer("density")} />
          </div>
        </Field>
      </div>
    </div>
  );
}

function Check({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-1.5 text-[11.5px] text-wl-text-secondary">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-3 w-3 accent-[#E8751A]"
      />
      {label}
    </label>
  );
}
