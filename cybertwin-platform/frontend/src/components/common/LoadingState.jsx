function LoadingState({ variant = "card", label }) {
  if (variant === "table") {
    return (
      <div className="card" aria-busy="true" aria-label={label ?? "Loading"}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton skeleton-table-row" />
        ))}
      </div>
    );
  }

  if (variant === "rows") {
    return (
      <div className="card" aria-busy="true" aria-label={label ?? "Loading"}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i}>
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line skeleton-line--w60" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="card" aria-busy="true" aria-label={label ?? "Loading"}>
      <div className="skeleton skeleton-card" />
    </div>
  );
}

export default LoadingState;
