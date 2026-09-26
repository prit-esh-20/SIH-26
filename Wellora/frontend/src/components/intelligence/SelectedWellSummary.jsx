import { Layers, MapPin } from "lucide-react";
import SectionHeader from "../common/SectionHeader.jsx";
import MetricDisplay from "../common/MetricDisplay.jsx";
import SeverityChip from "../common/SeverityChip.jsx";
import {
  getComparableEntry,
  getEventsForWell,
  getWell,
  getTotalNptForWell,
} from "../../data/mockData.js";

export default function SelectedWellSummary({ selectedWellId }) {
  const entry = getComparableEntry(selectedWellId);
  const well = getWell(selectedWellId);
  const events = getEventsForWell(selectedWellId);
  const npt = getTotalNptForWell(selectedWellId);

  return (
    <section className="wl-card">
      <SectionHeader
        icon={Layers}
        title="Selected Well"
        actions={
          <span className="text-[10.5px] text-wl-text-muted">Historical offset well</span>
        }
      />
      <div className="flex flex-wrap items-center gap-x-10 gap-y-3 px-6 pb-4 pt-3.5">
        <div>
          <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-wl-text-muted">
            Well
          </div>
          <div className="mt-0.5 text-[22px] font-semibold leading-none tracking-wide">
            {selectedWellId}
          </div>
        </div>

        <div className="h-11 w-px bg-wl-border" />

        <MetricDisplay label="Distance" value={entry ? entry.distanceKm.toFixed(1) : "-"} unit="km" />
        <MetricDisplay label="Formation" value={entry?.formation ?? well?.formation ?? "-"} />
        <MetricDisplay
          label="Total Depth"
          value={(well?.depth ?? 0).toLocaleString("en-IN")}
          unit="m"
        />
        <MetricDisplay label="Similarity" value={entry ? `${entry.similarity}%` : "-"} />

        <div className="ml-auto flex items-center gap-8">
          <div className="flex items-center gap-2 text-[12px] text-wl-text-secondary">
            <MapPin size={13} className="text-wl-text-muted" />
            <span>{well?.status}</span>
          </div>
          <div>
            <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-wl-text-muted">
              Historical Events
            </div>
            <div className="tabular mt-0.5 font-mono text-[15px] font-semibold">{events.length}</div>
          </div>
          <div>
            <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-wl-text-muted">
              Total NPT
            </div>
            <div className="tabular mt-0.5 font-mono text-[15px] font-semibold">
              {npt.toFixed(1)} h
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
