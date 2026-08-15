import { TriangleAlert } from "lucide-react";

import Button from "./Button";

function ErrorState({ title = "Something went wrong", text, onRetry }) {
  return (
    <div className="state-block state-block--card" role="alert">
      <div className="state-block__icon" aria-hidden="true">
        <TriangleAlert size={20} />
      </div>
      <div className="state-block__title">{title}</div>
      {text && <div className="state-block__text">{text}</div>}
      {onRetry && (
        <div className="state-block__action">
          <Button size="sm" onClick={onRetry}>
            Retry
          </Button>
        </div>
      )}
    </div>
  );
}

export default ErrorState;
