import { ArrowRight } from "lucide-react";

import Card from "../common/Card";
import Badge from "../common/Badge";

function AttackPathSummary({ paths }) {
  return (
    <Card
      title="Top Attack Paths"
      action={<span className="badge badge--neutral">Attack surface</span>}
    >
      {(!paths || paths.length === 0) && (
        <div className="state-block__text">No attack paths available.</div>
      )}

      <div className="attack-path-list">
        {paths?.map((path) => (
          <div className="attack-path-item" key={path.id}>
            <div className="attack-path-item__top">
              <span className="attack-path-item__name">{path.name}</span>
              <div className="attack-path-item__badges">
                <Badge tone={path.risk.toLowerCase()}>Risk {path.risk}</Badge>
                <Badge tone={path.impact.toLowerCase()}>Impact {path.impact}</Badge>
              </div>
            </div>

            <div className="flow-chips" aria-label={`Attack path: ${path.path.join(" → ")}`}>
              {path.path.map((step, index) => (
                <span className="flow-chips" key={`${path.id}-${step}`}>
                  {index > 0 && (
                    <ArrowRight size={12} className="chip-arrow" aria-hidden="true" />
                  )}
                  <span className={`chip ${index > 0 ? "" : "chip--accent"}`}>{step}</span>
                </span>
              ))}
            </div>

            <div className="attack-path-item__desc">{path.description}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default AttackPathSummary;
