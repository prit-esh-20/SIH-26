import { Gauge } from "lucide-react";
import SectionHeader from "../common/SectionHeader.jsx";

export default function EventParameters({ selectedEvent }) {
  if (!selectedEvent?.params) {
    return (
      <section className="wl-card flex flex-col">
        <SectionHeader icon={Gauge} title="Drilling Parameters at Event" />
        <div className="flex flex-1 items-center justify-center px-6 py-8 text-[12px] text-wl-text-muted">
          Select an event to view the recorded drilling parameters.
        </div>
      </section>
    );
  }

  const p = selectedEvent.params;
  const items = [
    { label: "Depth", value: `${selectedEvent.depth.toLocaleString("en-IN")} m` },
    { label: "ROP", value: `${p.rop.toFixed(1)} m/hr` },
    { label: "WOB", value: `${p.wob.toFixed(1)} klb` },
    { label: "RPM", value: `${p.rpm} rpm` },
    { label: "Torque", value: `${p.torque.toFixed(1)} kNm` },
    { label: "Mud Weight", value: `${p.mudWeight.toFixed(2)} SG` },
    { label: "Flow Rate", value: `${p.flowRate} L/min` },
    { label: "Pressure", value: `${p.standpipe.toLocaleString("en-IN")} psi` },
  ];

  return (
    <section className="wl-card flex flex-col">
      <SectionHeader
        icon={Gauge}
        title="Drilling Parameters at Event"
        actions={
          <span className="text-[10.5px] text-wl-text-muted">
            {selectedEvent.wellId} · {selectedEvent.eventType}
          </span>
        }
      />
      <div className="grid grid-cols-4 gap-x-4 gap-y-3.5 px-5 py-4">
        {items.map((it) => (
          <div key={it.label}>
            <div className="text-[9.5px] font-medium uppercase tracking-[0.1em] text-wl-text-muted">
              {it.label}
            </div>
            <div className="tabular mt-0.5 font-mono text-[14px] font-semibold text-wl-text-primary">
              {it.value}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-wl-border px-4 py-2.5 text-[10px] text-wl-text-muted">
        Operating conditions recorded when the event occurred. Representative values.
      </div>
    </section>
  );
}
