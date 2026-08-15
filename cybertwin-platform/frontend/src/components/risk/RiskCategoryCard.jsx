import Badge from "../common/Badge";
import ProgressBar from "../common/ProgressBar";

function RiskCategoryCard({ category, selected, onSelect }) {
  return (
    <button
      type="button"
      className={`risk-category ${selected ? "is-selected" : ""}`}
      onClick={() => onSelect?.(category)}
      aria-pressed={selected}
    >
      <div className="risk-category__head">
        <span className="risk-category__name">{category.name}</span>
        <Badge severity={category.severity}>{category.severity.toUpperCase()}</Badge>
      </div>

      <div className="risk-category__score">
        <span className="risk-category__number">{category.score}</span>
        <span className="field-hint">/ 100</span>
      </div>

      <ProgressBar
        value={category.score}
        tone={category.severity}
        aria-label={`${category.name} score ${category.score}`}
      />

      <div className="risk-category__desc">{category.explanation}</div>
    </button>
  );
}

export default RiskCategoryCard;
