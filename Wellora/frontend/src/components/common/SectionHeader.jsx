export default function SectionHeader({ icon: Icon, title, actions }) {
  return (
    <div className="wl-panel-head">
      <div className="wl-panel-title">
        {Icon && <Icon size={13} strokeWidth={2} />}
        <span>{title}</span>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
