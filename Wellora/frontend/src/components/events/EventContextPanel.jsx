import { GitCompare } from "lucide-react";
import SectionHeader from "../common/SectionHeader.jsx";
import { useWellContext } from "../../context/WellContext.jsx";
import { getWell } from "../../data/mockData.js";

export default function EventContextPanel({ event }) {
  const { activeWellId } = useWellContext();
  const current = getWell(activeWellId);

  if (!event || !current) {
    return (
      <section className="wl-card flex flex-col">
        <SectionHeader icon={GitCompare} title="Event Context" />
        <div className="flex flex-1 items-center justify-center px-6 py-8 text-[12px] text-wl-text-muted">
          Select an event to compare it with the current well.
        </div>
      </section>
    );
  }

  const diff = event.depth - current.depth;
  const absDiff = Math.abs(diff);
  const sameFormation = event.formation === current.formation;

  return (
    <section className="wl-card flex flex-col">
      <SectionHeader
        icon={GitCompare}
        title="Event Context"
        actions={<span className="text-[10.5px] text-wl-text-muted">vs current well {current.id}</span>}
      />
      <div className="px-5 py-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
          <Kv label="Current Well" value={current.id} />
          <Kv label="Current Depth" value={`${current.depth.toLocaleString("en-IN")} m`} />
          <Kv label="Event Depth" value={`${event.depth.toLocaleString("en-IN")} m`} />
          <Kv
            label="Depth Difference"
            value={`${diff >= 0 ? "+" : "-"}${absDiff} m`}
            accent
          />
          <Kv label="Current Formation" value={current.formation} />
          <Kv label="Event Formation" value={event.formation} />
        </div>

        <div className="mt-4 border-t border-wl-border pt-3">
          <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-wl-text-muted">
            Why This Event Is Relevant
          </div>
          <ul className="mt-2 space-y-1.5 text-[11.5px]">
            <li className="flex items-start gap-2">
              <Dot on={sameFormation} />
              <span className="text-wl-text-secondary">
                {sameFormation ? "Same formation" : "Different formation"}: {event.formation}
                {current ? ` (current: ${current.formation})` : ""}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Dot on />
              <span className="text-wl-text-secondary">
                Historical event recorded {absDiff} m {diff >= 0 ? "below" : "above"} the current bit depth
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Dot on={Boolean(event.params)} />
              <span className="text-wl-text-secondary">
                {event.params ? "Operating conditions recorded at the event" : "No parameter record for this event"}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Dot on={Boolean(event.mitigation)} />
              <span className="text-wl-text-secondary">
                Recorded mitigation response available: {event.mitigation}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Dot on />
              <span className="text-wl-text-secondary">
                Historical NPT: {event.nptHours.toFixed(1)} h
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-wl-border px-4 py-2.5 text-[10px] leading-relaxed text-wl-text-muted">
        Factual relationships from the dataset. Historical evidence, not a prediction.
      </div>
    </section>
  );
}

function Kv({ label, value, accent = false }) {
  return (
    <div>
      <div className="text-[9.5px] font-medium uppercase tracking-[0.1em] text-wl-text-muted">{label}</div>
      <div
        className={`tabular mt-0.5 font-mono text-[12px] font-medium ${accent ? "text-wl-accent-dark" : "text-wl-text-primary"}`}
      >
        {value}
      </div>
    </div>
  );
}

function Dot({ on }) {
  return (
    <span
      className="mt-[5px] inline-block h-1.5 w-1.5 shrink-0 rounded-full"
      style={{ backgroundColor: on ? "#E8751A" : "#c8ceca" }}
    />
  );
}
