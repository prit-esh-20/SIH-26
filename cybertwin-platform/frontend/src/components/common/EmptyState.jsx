function EmptyState({ icon: Icon, title, text, action, className = "" }) {
  return (
    <div className={`state-block state-block--card ${className}`}>
      {Icon && (
        <div className="state-block__icon" aria-hidden="true">
          <Icon size={20} />
        </div>
      )}
      <div className="state-block__title">{title}</div>
      {text && <div className="state-block__text">{text}</div>}
      {action && <div className="state-block__action">{action}</div>}
    </div>
  );
}

export default EmptyState;
