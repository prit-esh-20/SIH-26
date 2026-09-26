export default function PageHeader({ title, subtitle }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-[19px] font-semibold tracking-wide text-wl-text-primary">{title}</h2>
        <p className="mt-0.5 text-[12.5px] text-wl-text-secondary">{subtitle}</p>
      </div>
    </div>
  );
}
