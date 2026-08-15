import { Activity, Building2, PlayCircle, ShieldHalf } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ACTIONS = [
  {
    id: "simulate",
    title: "Run Simulation",
    hint: "Simulate an attack on the digital twin",
    icon: PlayCircle,
    to: "/simulation",
  },
  {
    id: "organization",
    title: "View Organization",
    hint: "Explore the organization's digital twin",
    icon: Building2,
    to: "/organization",
  },
  {
    id: "risk",
    title: "Analyze Risk",
    hint: "Break down risk by category",
    icon: Activity,
    to: "/risk",
  },
  {
    id: "controls",
    title: "Review Controls",
    hint: "Compare security control impact",
    icon: ShieldHalf,
    to: "/risk?focus=controls",
  },
];

function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="quick-actions">
      {ACTIONS.map((action) => {
        const Icon = action.icon;
        return (
          <button
            type="button"
            key={action.id}
            className="quick-action"
            onClick={() => navigate(action.to)}
          >
            <span className="quick-action__icon" aria-hidden="true">
              <Icon size={17} />
            </span>
            <span>
              <div className="quick-action__title">{action.title}</div>
              <div className="quick-action__hint">{action.hint}</div>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default QuickActions;
