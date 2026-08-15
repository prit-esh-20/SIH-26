import Card from "../common/Card";
import Badge from "../common/Badge";

const STATUS_TONES = {
  Simulated: "violet",
  Applied: "info",
  Open: "danger",
  Blocked: "success",
  Completed: "neutral",
};

function SecurityEvents({ events }) {
  return (
    <Card title="Recent Security Events">
      {(!events || events.length === 0) && (
        <div className="state-block__text">No security events recorded.</div>
      )}

      <div className="event-list">
        {events?.map((event) => (
          <div className="event-item" key={event.id}>
            <span className="event-item__time">{event.time}</span>
            <div className="event-item__body">
              <div className="event-item__name">{event.event}</div>
            </div>
            <Badge tone={event.severity.toLowerCase()}>{event.severity}</Badge>
            <Badge tone={STATUS_TONES[event.status] ?? "neutral"}>{event.status}</Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default SecurityEvents;
