import { useMemo, useState } from "react";
import { Bell } from "lucide-react";
import PageHeader from "../components/intelligence/PageHeader.jsx";
import AlertsFilterBar, {
  EMPTY_ALERT_FILTERS,
  applyAlertsFilters,
} from "../components/alerts/AlertsFilterBar.jsx";
import AlertsList from "../components/alerts/AlertsList.jsx";
import AlertDetails from "../components/alerts/AlertDetails.jsx";
import { useWellContext } from "../context/WellContext.jsx";
import { getAllAlerts, getWell } from "../data/mockData.js";

const SEVERITY_ORDER = { High: 0, Medium: 1, Low: 2 };

export default function Alerts() {
  const { activeWellId } = useWellContext();
  const [filters, setFilters] = useState(EMPTY_ALERT_FILTERS);
  const [selectedId, setSelectedId] = useState("RA-205-1");

  // All generated alerts across the dataset; the Well filter narrows by well.
  const alerts = useMemo(() => {
    const list = [...getAllAlerts()];
    list.sort(
      (a, b) =>
        (SEVERITY_ORDER[a.severity] ?? 9) - (SEVERITY_ORDER[b.severity] ?? 9) ||
        a.distanceToRiskM - b.distanceToRiskM
    );
    return list;
  }, []);

  const filtered = useMemo(
    () => applyAlertsFilters(alerts, filters),
    [alerts, filters]
  );

  // Keep a valid selection when filters hide the selected alert.
  const effectiveSelectedId = filtered.some((a) => a.id === selectedId)
    ? selectedId
    : (filtered[0]?.id ?? null);
  const selected = filtered.find((a) => a.id === effectiveSelectedId) ?? null;
  const current = getWell(activeWellId);

  const summary = useMemo(() => {
    const active = alerts.filter((a) => a.status !== "Reviewed");
    const bySeverity = (s) => active.filter((a) => a.severity === s).length;
    return {
      total: active.length,
      high: bySeverity("High"),
      medium: bySeverity("Medium"),
      low: bySeverity("Low"),
    };
  }, [alerts]);

  return (
    <div className="mx-auto max-w-[1720px] space-y-4 pb-8">
      <PageHeader
        title="Alerts"
        subtitle="Review active drilling-risk alerts, historical hazard proximity, and supporting evidence for the current well."
        aside={
          <span className="flex items-center gap-2 text-[11px] text-wl-text-muted">
            <Bell size={12} />
            Representative prototype data
          </span>
        }
      />

      {/* Summary strip */}
      <section className="wl-card flex flex-wrap items-center gap-x-10 gap-y-3 px-6 py-3.5">
        <SummaryItem label="Active Alerts" value={summary.total} />
        <SummaryItem label="High" value={summary.high} />
        <SummaryItem label="Medium" value={summary.medium} />
        <SummaryItem label="Low" value={summary.low} />
        <SummaryItem label="Current Well" value={activeWellId} />
        <SummaryItem
          label="Current Depth"
          value={`${current ? current.depth.toLocaleString("en-IN") : "-"} m`}
        />
        <SummaryItem label="Formation" value={current?.formation ?? "-"} />
        <span className="ml-auto max-w-[340px] text-right text-[10px] leading-relaxed text-wl-text-muted">
          Representative prototype data. Production deployment would use authorized operator datasets.
        </span>
      </section>

      <AlertsFilterBar filters={filters} onChange={setFilters} />

      {/* Two-column layout: list left, sticky details right */}
      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)]">
        <AlertsList
          alerts={filtered}
          total={alerts.length}
          selectedId={effectiveSelectedId}
          onSelect={setSelectedId}
        />
        <div className="xl:sticky xl:top-0 xl:self-start">
          <AlertDetails alert={selected} />
        </div>
      </div>
    </div>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div>
      <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-wl-text-muted">
        {label}
      </div>
      <div className="tabular mt-0.5 text-[16px] font-semibold text-wl-text-primary">{value}</div>
    </div>
  );
}
