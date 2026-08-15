function Tabs({ items, activeId, onChange, "aria-label": ariaLabel }) {
  return (
    <div className="tabs" role="tablist" aria-label={ariaLabel ?? "Tabs"}>
      {items.map((item) => {
        const Icon = item.icon;
        const active = item.id === activeId;

        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            className={`tab ${active ? "active" : ""}`}
            onClick={() => onChange(item.id)}
          >
            {Icon && <Icon size={14} />}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
