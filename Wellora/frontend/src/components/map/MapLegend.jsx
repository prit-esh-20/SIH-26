import { Layers } from "lucide-react";
import SectionHeader from "../common/SectionHeader.jsx";

function Dot({ color, size = 10, label }) {
  return (
    <div className="flex items-center gap-2 text-[11.5px] text-wl-text-secondary">
      <span
        className="inline-block shrink-0 rounded-full border-2 border-white"
        style={{ width: size, height: size, backgroundColor: color, boxShadow: "0 0 0 1px rgba(23,32,29,0.15)" }}
      />
      {label}
    </div>
  );
}

export default function MapLegend() {
  return (
    <section className="wl-card flex flex-col">
      <SectionHeader icon={Layers} title="Legend" />
      <div className="grid flex-1 grid-cols-1 gap-x-6 gap-y-2 px-5 py-4 sm:grid-cols-2">
        <Dot color="#E8751A" size={12} label="Current well" />
        <Dot color="#56615D" size={11} label="Comparable well" />
        <Dot color="#8b9591" size={9} label="Other nearby well" />
        <div className="col-span-full mt-1 text-[9.5px] font-semibold uppercase tracking-[0.12em] text-wl-text-muted">
          Historical events
        </div>
        <Dot color="#3f7d55" size={8} label="Low severity" />
        <Dot color="#b97800" size={8} label="Medium severity" />
        <Dot color="#c84435" size={8} label="High severity" />
        <div className="col-span-full mt-1 text-[9.5px] font-semibold uppercase tracking-[0.12em] text-wl-text-muted">
          Heatmap
        </div>
        <div className="col-span-full text-[11px] leading-relaxed text-wl-text-secondary">
          Red shading indicates historical event density: concentration of recorded drilling events, not
          predicted risk.
        </div>
      </div>
    </section>
  );
}
