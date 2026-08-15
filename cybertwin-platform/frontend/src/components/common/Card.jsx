function Card({ title, action, children, className = "" }) {
  return (
    <section className={`card ${className}`}>
      {(title || action) && (
        <div className="card-header">
          {title && <h2 className="card-title">{title}</h2>}
          {action && <div className="card-actions">{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

export default Card;
