import { FileBarChart } from "lucide-react";
import SectionHeader from "../common/SectionHeader.jsx";
import SeverityChip from "../common/SeverityChip.jsx";
import { getReportEvidence, getWell } from "../../data/mockData.js";

export default function ReportPreview({ report }) {
  if (!report) return null;
  const well = getWell(report.wellId);
  const evidence = getReportEvidence(report);

  const sections = [
    {
      title: "1. Current Well Context",
      body: `${report.wellId} is drilling at ${report.depth.toLocaleString("en-IN")} m in ${report.formation} using a ${well?.holeSection ?? '8-1/2"'} hole section. Region: Assam, India.`,
    },
    {
      title: "2. Comparable Wells",
      body: "Five offset wells analysed within geographic, geological, depth, operational and event context. Strongest matches: W-201 (87%), W-198 (81%), W-187 (72%).",
    },
    {
      title: "3. Historical Events",
      body: `${evidence.length} historical events referenced, including mud loss at ${evidence[0]?.depth.toLocaleString("en-IN") ?? "2,875"} m on ${evidence[0]?.wellId ?? "W-201"}.`,
    },
    {
      title: "4. Active Alerts",
      body: "High mud-loss risk approaching (82%, 2,870 - 2,900 m, 10 m from current depth). Medium stuck-pipe and low tight-hole risks further ahead.",
    },
    {
      title: "5. Supporting Evidence",
      body: "DDR-W201 p.37, WCR-W198 p.112, DDR-W187 p.55 and related records support the analysis.",
    },
    {
      title: "6. Historical Responses",
      body: "LCM treatment, reduced circulation rate and pipe-freeing responses recorded on comparable wells. Recorded responses, not prescriptions.",
    },
  ];

  return (
    <section className="wl-card flex flex-col">
      <SectionHeader
        icon={FileBarChart}
        title="Report Preview"
        actions={<span className="text-[10.5px] text-wl-text-muted">Representative prototype preview</span>}
      />
      <div className="px-5 py-4">
        <div className="rounded-[5px] border border-wl-border bg-wl-surface-2 px-5 py-4">
          {/* Document header */}
          <div className="border-b border-wl-border pb-3.5 text-center">
            <div className="text-[11px] font-semibold tracking-[0.28em] text-wl-text-primary">WELLORA</div>
            <div className="mt-0.5 text-[8.5px] font-medium tracking-[0.22em] text-wl-text-muted">
              NEARBY WELLS INTELLIGENCE
            </div>
            <div className="mt-2.5 text-[14px] font-semibold tracking-wide text-wl-text-primary">
              DRILLING INTELLIGENCE REPORT
            </div>
            <div className="mt-1 text-[10.5px] text-wl-text-muted">
              {report.title} · {report.type}
            </div>
          </div>

          {/* Document meta */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 border-b border-wl-border py-3 sm:grid-cols-3">
            <PreviewKv label="Well" value={report.wellId} />
            <PreviewKv label="Region" value="Assam, India" />
            <PreviewKv label="Current Depth" value={`${report.depth.toLocaleString("en-IN")} m`} />
            <PreviewKv label="Formation" value={report.formation} />
            <PreviewKv label="Generated" value={report.generated} />
            <PreviewKv label="Status" value={report.status} />
          </div>

          {/* Document sections */}
          <div className="space-y-3 py-3.5">
            {sections.map((s) => (
              <div key={s.title}>
                <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-wl-text-secondary">
                  {s.title}
                </div>
                <p className="mt-1 text-[12px] leading-relaxed text-wl-text-primary">{s.body}</p>
              </div>
            ))}
          </div>

          {/* Evidence chips */}
          <div className="border-t border-wl-border pt-3">
            <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-wl-text-muted">
              Referenced events
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {evidence.map((ev) => (
                <span
                  key={ev.id}
                  className="tabular inline-flex items-center gap-1.5 rounded-[3px] border border-wl-border bg-wl-surface px-2 py-0.5 font-mono text-[10px] text-wl-text-secondary"
                >
                  {ev.wellId} · {ev.depth.toLocaleString("en-IN")} m
                  <SeverityChip severity={ev.severity} />
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3 text-[10px] leading-relaxed text-wl-text-muted">
          Prototype preview generated from representative Wellora data. Production deployment would
          render authorized operator datasets as formatted documents.
        </div>
      </div>
    </section>
  );
}

function PreviewKv({ label, value }) {
  return (
    <div>
      <div className="text-[9px] font-semibold uppercase tracking-[0.12em] text-wl-text-muted">{label}</div>
      <div className="mt-0.5 text-[12px] font-medium text-wl-text-primary">{value}</div>
    </div>
  );
}
