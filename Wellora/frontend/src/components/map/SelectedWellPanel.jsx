import { Layers, MapPin } from "lucide-react";
import SectionHeader from "../common/SectionHeader.jsx";
import {
  formations,
  getComparableEntry,
  getEventsForWell,
  getWell,
} from "../../data/mockData.js";

export default function SelectedWellPanel({ activeWellId, selectedWellId, onViewWell }) {
  const entry = selectedWellId ? getComparableEntry(selectedWellId) : null;
  const well = selectedWellId ? getWell(selectedWellId) : null;
  const current = getWell(activeWellId);
  const events = selectedWellId ? getEventsForWell(selectedWellId) : [];

  return (
    <section className="wl-card flex flex-col">
      <SectionHeader
        icon={Layers}
        title="Selected Well"
        actions={
          entry ? (
            <button type="button" className="wl-btn !py-1 !text-[10px]" onClick={onViewWell}>
              View in Well Intelligence
            </button>
          ) : null
        }
      />
      {entry && well ? (
        <div className="px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-wl-text-muted">
                Well
              </div>
              <div className="mt-0.5 text-[20px] font-semibold leading-none tracking-wide">
                {selectedWellId}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-wl-text-muted">
                Similarity
              </div>
              <div className="tabular mt-0.5 font-mono text-[18px] font-semibold text-wl-accent-dark">
                {entry.similarity}%
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-wl-border pt-3 text-[11.5px]">
            <Kv label="Distance" value={`${entry.distanceKm.toFixed(1)} km`} />
            <Kv label="Formation" value={entry.formation} />
            <Kv label="Total Depth" value={`${(well.depth ?? 0).toLocaleString("en-IN")} m`} />
            <Kv label="Status" value={well.status} />
            <Kv label="Historical Events" value={String(events.length)} />
            <Kv
              label="Relevant Interval"
              value={`${entry.relevantInterval[0].toLocaleString("en-IN")} - ${entry.relevantInterval[1].toLocaleString("en-IN")} m`}
            />
          </div>

          <div className="mt-4">
            <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-wl-text-muted">
              Why This Well Matters
            </div>
            <ul className="mt-2 space-y-1.5">
              <Factor icon={MapPin} label="Geographic" detail={`${entry.distanceKm.toFixed(1)} km from current well`} />
              <Factor
                icon={Layers}
                label="Geological"
                detail={
                  entry.formation === current?.formation
                    ? `Same formation: ${entry.formation}`
                    : `Adjacent formation: ${entry.formation}`
                }
              />
              <Factor
                icon={Layers}
                label="Depth"
                detail={`Relevant interval ${entry.relevantInterval[0].toLocaleString("en-IN")} - ${entry.relevantInterval[1].toLocaleString("en-IN")} m`}
              />
              <Factor
                icon={Layers}
                label="Operational"
                detail={current ? `Comparable hole section (${current.holeSection})` : "Comparable section"}
              />
              <Factor
                icon={Layers}
                label="Historical"
                detail={`${events.length} drilling event${events.length === 1 ? "" : "s"} under comparable conditions`}
              />
            </ul>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center px-6 py-8 text-center text-[12px] text-wl-text-muted">
          Select a well on the map or in the table to view offset context.
        </div>
      )}
    </section>
  );
}

function Kv({ label, value }) {
  return (
    <div>
      <div className="text-[9.5px] font-medium uppercase tracking-[0.1em] text-wl-text-muted">{label}</div>
      <div className="tabular mt-0.5 font-mono text-[12px] font-medium text-wl-text-primary">{value}</div>
    </div>
  );
}

function Factor({ icon: Icon, label, detail }) {
  return (
    <li className="flex items-start gap-2 text-[11.5px]">
      <Icon size={12} className="mt-[3px] shrink-0 text-wl-accent-dark" />
      <span>
        <span className="font-medium text-wl-text-primary">{label}:</span>{" "}
        <span className="text-wl-text-secondary">{detail}</span>
      </span>
    </li>
  );
}
