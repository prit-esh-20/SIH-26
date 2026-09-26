export default function PageHeader({ title, subtitle, aside = null }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-[19px] font-semibold tracking-wide text-wl-text-primary">{title}</h2>
        <p className="mt-0.5 max-w-[760px] text-[12.5px] text-wl-text-secondary">{subtitle}</p>
      </div>
      {aside && <div className="shrink-0 pb-1">{aside}</div>}
    </div>
  );
}
