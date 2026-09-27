import { FileBarChart, FileText } from "lucide-react";
import SectionHeader from "../common/SectionHeader.jsx";
import SeverityChip from "../common/SeverityChip.jsx";
import { useNavigate } from "react-router-dom";
import {
  getReportDocuments,
  getReportEvidence,
  getWell,
  comparableWells,
} from "../../data/mockData.js";

const SIMILARITY_FILL = "#E8751A";

export default function ReportAnalysis({ report }) {
  const navigate = useNavigate();

  if (!report) return null;

  const well = getWell(report.wellId);
  const evidence = getReportEvidence(report);
  const docs = getReportDocuments(report);
  const comps = comparableWells;

  const riskRows = [
    { severity: "High", label: "Mud Loss Risk", pct: 82, zone: "2,870 - 2,900 m", dist: "10 m from current depth" },
    { severity: "Medium", label: "Stuck Pipe Risk", pct: 54, zone: "2,900 - 2,930 m", dist: "40 m from current depth" },
    { severity: "Low", label: "Tight Hole Risk", pct: 38, zone: "2,884 - 2,910 m", dist: "24 m from current depth" },
  ];

  return (
    <>
      {/* Report summary + risk summary */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="wl-card flex flex-col">
          <SectionHeader icon={FileBarChart} title="Report Summary" />
          <div className="px-5 py-4">
            <p className="text-[12.5px] leading-relaxed text-wl-text-primary">
              Current well {report.wellId} is drilling at {report.depth.toLocaleString("en-IN")} m in
              formation {report.formation} using a {well?.holeSection ?? '8-1/2"'} hole section.
              Historical offset analysis identifies {comps.length} comparable wells within the relevant
              geographic, geological, depth, operational, and event context.
            </p>
            <p className="mt-2.5 text-[12.5px] leading-relaxed text-wl-text-primary">
              An active historical mud-loss risk is approaching the current drilling depth.
            </p>
            <div className="mt-3 border-t border-wl-border pt-2.5 text-[10px] leading-relaxed text-wl-text-muted">
              Representative prototype data. Production deployment would use authorized operator datasets.
            </div>
          </div>
        </section>

        <section className="wl-card flex flex-col">
          <SectionHeader
            icon={FileBarChart}
            title="Risk Summary"
            actions={<span className="text-[10.5px] text-wl-text-muted">Approaching historical zones</span>}
          />
          <div className="space-y-2 px-4 py-3.5">
            {riskRows.map((r) => (
              <div
                key={r.label}
                className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-[5px] border border-wl-border bg-wl-surface-2 px-3.5 py-2.5"
              >
                <SeverityChip severity={r.severity} />
                <span className="text-[12.5px] font-medium text-wl-text-primary">{r.label}</span>
                <span className="tabular font-mono text-[12px] font-semibold text-wl-text-primary">
                  {r.pct}%
                </span>
                <span className="tabular font-mono text-[11px] text-wl-text-secondary">{r.zone}</span>
                <span className="ml-auto text-[11px] text-wl-text-muted">{r.dist}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-wl-border px-4 py-2.5 text-[10px] leading-relaxed text-wl-text-muted">
            Risk estimates are representative prototype values, not predictions.
          </div>
        </section>
      </div>

      {/* Comparable wells + historical evidence */}
      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <section className="wl-card flex flex-col">
          <SectionHeader
            icon={FileBarChart}
            title="Comparable Wells"
            actions={<span className="text-[10.5px] text-wl-text-muted">Offsets used in this analysis</span>}
          />
          <table className="w-full border-collapse text-[12px]">
            <thead>
              <tr className="border-b border-wl-border bg-wl-surface-2">
                <th className="wl-table-head px-4 py-2">Well</th>
                <th className="wl-table-head px-4 py-2">Distance</th>
                <th className="wl-table-head px-4 py-2">Formation</th>
                <th className="wl-table-head px-4 py-2">Similarity</th>
                <th className="wl-table-head px-4 py-2 text-right">Events</th>
              </tr>
            </thead>
            <tbody>
              {comps.map((c) => (
                <tr key={c.wellId} className="border-b border-wl-border/70 last:border-0">
                  <td className="px-4 py-[7px] font-medium text-wl-text-primary">{c.wellId}</td>
                  <td className="tabular font-mono px-4 py-[7px] text-[12px]">{c.distanceKm.toFixed(1)} km</td>
                  <td className="px-4 py-[7px] text-wl-text-secondary">{c.formation}</td>
                  <td className="px-4 py-[7px]">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-14 overflow-hidden rounded-[2px] bg-wl-surface-3">
                        <div className="h-full rounded-[2px]" style={{ width: `${c.similarity}%`, backgroundColor: SIMILARITY_FILL }} />
                      </div>
                      <span className="tabular font-mono text-[11.5px] text-wl-text-secondary">{c.similarity}%</span>
                    </div>
                  </td>
                  <td className="tabular px-4 py-[7px] text-right font-mono text-[12px]">{c.events}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="wl-card flex flex-col">
          <SectionHeader
            icon={FileText}
            title="Historical Evidence"
            actions={
              <button type="button" className="wl-btn !px-2.5 !py-1 !text-[10px]" onClick={() => navigate("/events")}>
                View All Events
              </button>
            }
          />
          <div className="space-y-1.5 px-4 py-3.5">
            {evidence.map((ev) => (
              <button
                key={ev.id}
                type="button"
                onClick={() => navigate("/events")}
                className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 rounded-[5px] border border-wl-border bg-wl-surface-2 px-3.5 py-2.5 text-left transition-colors duration-100 hover:border-wl-accent hover:bg-wl-accent-faint"
                title={`Open ${ev.eventType} on ${ev.wellId} in Historical Events`}
              >
                <span className="tabular font-mono text-[12.5px] font-semibold text-wl-text-primary">
                  {ev.depth.toLocaleString("en-IN")} m
                </span>
                <span className="text-[12px] text-wl-text-primary">{ev.eventType}</span>
                <span className="text-[11.5px] font-medium text-wl-text-secondary">{ev.wellId}</span>
                <SeverityChip severity={ev.severity} />
                <span className="ml-auto tabular font-mono text-[11px] text-wl-text-muted">
                  NPT: {ev.nptHours} h
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Source documents */}
      <section className="wl-card flex flex-col">
        <SectionHeader
          icon={FileText}
          title="Source Documents"
          actions={<span className="text-[10.5px] text-wl-text-muted">Documents cited in this report</span>}
        />
        <div className="grid grid-cols-1 gap-2 px-4 py-3.5 sm:grid-cols-2 xl:grid-cols-4">
          {docs.map((d) => (
            <div key={d.id} className="rounded-[5px] border border-wl-border bg-wl-surface-2 px-3.5 py-2.5">
              <div className="font-mono text-[12.5px] font-semibold text-wl-text-primary">{d.documentId}</div>
              <div className="mt-0.5 text-[11px] text-wl-text-secondary">{d.type}</div>
              <div className="mt-1 text-[10.5px] text-wl-text-muted">
                Page {d.page} · {d.eventType ?? "-"} {d.depth ? `· ${d.depth.toLocaleString("en-IN")} m` : ""}
              </div>
              <button
                type="button"
                className="wl-btn mt-2 !px-2.5 !py-1 !text-[10px]"
                onClick={() => navigate("/documents")}
              >
                View Document
              </button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
