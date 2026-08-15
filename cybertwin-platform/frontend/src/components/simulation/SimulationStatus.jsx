import { Check, Loader2 } from "lucide-react";

import Card from "../common/Card";
import StatusIndicator from "../common/StatusIndicator";

function SimulationStatus({ steps, activeStep }) {
  return (
    <Card>
      <div className="sim-status" aria-live="polite" aria-busy="true">
        <div className="sim-status__head">
          <span className="card-title">Running simulation</span>
          <StatusIndicator tone="info" label="Simulating" pulse />
        </div>

        <div className="sim-steps">
          {steps.map((step, index) => {
            const state = index < activeStep ? "done" : index === activeStep ? "active" : "pending";

            return (
              <div className={`sim-step ${state}`} key={step}>
                <span className="sim-step__icon" aria-hidden="true">
                  {state === "done" ? (
                    <Check size={12} />
                  ) : state === "active" ? (
                    <span className="sim-spinner" />
                  ) : (
                    <Loader2 size={12} />
                  )}
                </span>
                <span>{step}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

export default SimulationStatus;
