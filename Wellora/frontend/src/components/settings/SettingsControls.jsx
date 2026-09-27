// Compact form controls for the Settings page. Local to settings/ because
// their sizing is purpose-built for dense configuration rows; other pages
// keep their existing components.

export function SettingsToggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-[18px] w-[32px] shrink-0 rounded-full border transition-colors duration-100 ${
        checked ? "border-wl-accent-dark bg-wl-accent" : "border-wl-border-strong bg-wl-surface-3"
      }`}
      title={checked ? "On" : "Off"}
    >
      <span
        className={`absolute top-1/2 h-[12px] w-[12px] -translate-y-1/2 rounded-full bg-wl-surface shadow-[0_1px_2px_rgba(23,32,29,0.25)] transition-all duration-100 ${
          checked ? "left-[16px]" : "left-[2px]"
        }`}
      />
    </button>
  );
}

export function CompactSelect({ value, onChange, options, label, className = "" }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      className={`h-7 rounded-[5px] border border-wl-border bg-wl-surface px-2 text-[11.5px] text-wl-text-primary transition-colors duration-100 focus:border-wl-accent ${className}`}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function SettingsRow({ label, hint, children }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-wl-border/60 py-2 last:border-0">
      <div className="min-w-0">
        <div className="text-[12px] font-medium text-wl-text-primary">{label}</div>
        {hint && <div className="mt-0.5 text-[10.5px] leading-relaxed text-wl-text-muted">{hint}</div>}
      </div>
      <div className="flex shrink-0 items-center gap-2">{children}</div>
    </div>
  );
}

export function SectionNote({ children }) {
  return (
    <div className="mt-2.5 border-t border-wl-border pt-2.5 text-[10.5px] leading-relaxed text-wl-text-muted">
      {children}
    </div>
  );
}
