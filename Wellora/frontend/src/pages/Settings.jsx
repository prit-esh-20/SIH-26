import { useMemo, useState } from "react";
import { Settings as SettingsIcon, FileBarChart, Info, Database, Map as MapIcon } from "lucide-react";
import PageHeader from "../components/intelligence/PageHeader.jsx";
import SectionHeader from "../components/common/SectionHeader.jsx";
import StatusDot from "../components/common/StatusIndicator.jsx";
import { SettingsRow, SettingsToggle, CompactSelect, SectionNote } from "../components/settings/SettingsControls.jsx";
import { ChangeWellModal, ResetConfirmDialog, SavedToast } from "../components/settings/SettingsDialogs.jsx";
import { useWellContext } from "../context/WellContext.jsx";
import {
  documentLibrary,
  historicalEvents,
  wells,
} from "../data/mockData.js";

const DEFAULT_SETTINGS = {
  radius: "10",
  minSimilarity: "60",
  eventWindow: "current",
  includeEvents: true,
  includeWells: true,
  includeEvidence: true,
  thresholdMudLoss: "70",
  thresholdStuckPipe: "60",
  thresholdKick: "70",
  thresholdTightHole: "50",
  depthProximity: "10",
  eventProximity: "50",
  theme: "light",
  mapRadius: "10",
  mapLabels: true,
  eventMarkers: true,
  heatmap: false,
  notifHighRisk: true,
  notifUpcoming: true,
  notifProximity: true,
  notifEvidence: true,
  notifReports: true,
};

export default function Settings() {
  const { activeWellId, setActiveWellId } = useWellContext();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [wellModalOpen, setWellModalOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [savedVisible, setSavedVisible] = useState(false);

  const set = (key) => (value) => setSettings((s) => ({ ...s, [key]: value }));

  const current = wells.find((w) => w.id === activeWellId);
  const stats = useMemo(
    () => ({
      wells: wells.length - 1,
      events: historicalEvents.length,
      documents: documentLibrary.length,
    }),
    []
  );

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    setResetOpen(false);
    setSavedVisible(true);
  };

  const dirty = JSON.stringify(settings) !== JSON.stringify(DEFAULT_SETTINGS);

  return (
    <div className="mx-auto max-w-[1200px] space-y-4 pb-8">
      <PageHeader
        title="Settings"
        subtitle="Configure Wellora preferences, drilling intelligence thresholds, and interface behaviour."
        aside={
          <span className="flex items-center gap-2 text-[11px] text-wl-text-muted">
            <SettingsIcon size={12} />
            Representative prototype configuration
          </span>
        }
      />

      {/* Engineer profile */}
      <section className="wl-card flex flex-col">
        <SectionHeader icon={Info} title="Engineer Profile" />
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 px-5 py-4 sm:grid-cols-3 lg:grid-cols-6">
          <Kv label="Name" value="Drill Engineer" />
          <Kv label="Role" value="Drilling Engineer" />
          <Kv label="Organization" value="Oil & Gas Operations" />
          <Kv label="Region" value="Assam, India" />
          <Kv label="Current Well" value={activeWellId} mono />
          <div>
            <div className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-wl-text-muted">Status</div>
            <div className="mt-1 flex items-center gap-1.5 text-[12.5px] font-medium text-wl-text-primary">
              <StatusDot status={current?.status} blink />
              Active
            </div>
          </div>
        </div>
      </section>

      {/* Current well */}
      <section className="wl-card flex flex-col">
        <SectionHeader
          icon={MapIcon}
          title="Current Well"
          actions={
            <button type="button" className="wl-btn h-7 !px-2.5 !text-[10px]" onClick={() => setWellModalOpen(true)}>
              Change Current Well
            </button>
          }
        />
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 px-5 py-4 sm:grid-cols-3 lg:grid-cols-5">
          <Kv label="Active Well" value={activeWellId} mono />
          <Kv label="Current Depth" value={`${current?.depth.toLocaleString("en-IN") ?? "-"} m`} mono />
          <Kv label="Formation" value={current?.formation ?? "-"} />
          <Kv label="Hole Section" value={current?.holeSection ?? "-"} />
          <Kv label="Region" value="Assam, India" />
        </div>
      </section>

      {/* Intelligence settings */}
      <section className="wl-card flex flex-col">
        <SectionHeader icon={SettingsIcon} title="Intelligence Settings" />
        <div className="px-5 py-3">
          <SettingsRow
            label="Nearby Well Search Radius"
            hint="Geographic range for comparable-well matches."
          >
            <CompactSelect
              label="Nearby well search radius"
              value={settings.radius}
              onChange={set("radius")}
              options={[
                { value: "5", label: "5 km" },
                { value: "10", label: "10 km" },
                { value: "25", label: "25 km" },
              ]}
            />
          </SettingsRow>
          <SettingsRow label="Minimum Similarity" hint="Lowest combined similarity index shown in lists.">
            <CompactSelect
              label="Minimum similarity"
              value={settings.minSimilarity}
              onChange={set("minSimilarity")}
              options={[
                { value: "any", label: "Any" },
                { value: "50", label: "50%" },
                { value: "60", label: "60%" },
                { value: "70", label: "70%" },
                { value: "80", label: "80%" },
              ]}
            />
          </SettingsRow>
          <SettingsRow label="Historical Event Window" hint="Depth range around the bit for event matching.">
            <CompactSelect
              label="Historical event window"
              value={settings.eventWindow}
              onChange={set("eventWindow")}
              options={[
                { value: "current", label: "Current interval" },
                { value: "50", label: "±50 m" },
                { value: "100", label: "±100 m" },
                { value: "250", label: "±250 m" },
              ]}
            />
          </SettingsRow>
          <SettingsRow label="Include Historical Events" hint="Surface recorded events in intelligence panels.">
            <SettingsToggle checked={settings.includeEvents} onChange={set("includeEvents")} label="Include historical events" />
          </SettingsRow>
          <SettingsRow label="Include Comparable Wells" hint="Surface offset wells in intelligence panels.">
            <SettingsToggle checked={settings.includeWells} onChange={set("includeWells")} label="Include comparable wells" />
          </SettingsRow>
          <SettingsRow label="Include Source Evidence" hint="Link DDR / WCR source references where available.">
            <SettingsToggle checked={settings.includeEvidence} onChange={set("includeEvidence")} label="Include source evidence" />
          </SettingsRow>
        </div>
      </section>

      {/* Alert settings */}
      <section className="wl-card flex flex-col">
        <SectionHeader icon={SettingsIcon} title="Alert Settings" />
        <div className="px-5 py-3">
          <div className="grid grid-cols-1 gap-x-8 lg:grid-cols-2">
            <SettingsRow label="Mud Loss Risk" hint="Alert threshold.">
              <ThresholdSelect value={settings.thresholdMudLoss} onChange={set("thresholdMudLoss")} />
            </SettingsRow>
            <SettingsRow label="Stuck Pipe Risk" hint="Alert threshold.">
              <ThresholdSelect value={settings.thresholdStuckPipe} onChange={set("thresholdStuckPipe")} />
            </SettingsRow>
            <SettingsRow label="Kick Risk" hint="Alert threshold.">
              <ThresholdSelect value={settings.thresholdKick} onChange={set("thresholdKick")} />
            </SettingsRow>
            <SettingsRow label="Tight Hole Risk" hint="Alert threshold.">
              <ThresholdSelect value={settings.thresholdTightHole} onChange={set("thresholdTightHole")} />
            </SettingsRow>
            <SettingsRow label="Depth Proximity Warning" hint="Distance to a risk zone before warning.">
              <ProximitySelect value={settings.depthProximity} onChange={set("depthProximity")} />
            </SettingsRow>
            <SettingsRow label="Historical Event Proximity" hint="Distance to a recorded event before flagging.">
              <ProximitySelect value={settings.eventProximity} onChange={set("eventProximity")} />
            </SettingsRow>
          </div>
          <SectionNote>
            Thresholds are prototype configuration values. Production thresholds would be validated
            against authorized operator data and engineering workflows.
          </SectionNote>
        </div>
      </section>

      {/* Display settings */}
      <section className="wl-card flex flex-col">
        <SectionHeader icon={MapIcon} title="Display Settings" />
        <div className="px-5 py-3">
          <SettingsRow label="Theme" hint="Light theme is the current Wellora interface.">
            <CompactSelect
              label="Theme"
              value={settings.theme}
              onChange={set("theme")}
              options={[{ value: "light", label: "Light" }]}
            />
          </SettingsRow>
          <SettingsRow label="Map Default Radius" hint="Initial radius ring on the Operational Map.">
            <CompactSelect
              label="Map default radius"
              value={settings.mapRadius}
              onChange={set("mapRadius")}
              options={[
                { value: "5", label: "5 km" },
                { value: "10", label: "10 km" },
                { value: "25", label: "25 km" },
              ]}
            />
          </SettingsRow>
          <SettingsRow label="Map Labels" hint="Well labels on the Operational Map.">
            <SettingsToggle checked={settings.mapLabels} onChange={set("mapLabels")} label="Map labels" />
          </SettingsRow>
          <SettingsRow label="Historical Event Markers" hint="Event markers on the Operational Map.">
            <SettingsToggle checked={settings.eventMarkers} onChange={set("eventMarkers")} label="Historical event markers" />
          </SettingsRow>
          <SettingsRow
            label="Heatmap"
            hint="Historical event density overlay on the Operational Map."
          >
            <SettingsToggle checked={settings.heatmap} onChange={set("heatmap")} label="Heatmap" />
          </SettingsRow>
          <SectionNote>
            Heatmap represents concentration of recorded historical events and is not a direct
            prediction of current-well risk.
          </SectionNote>
        </div>
      </section>

      {/* Notifications */}
      <section className="wl-card flex flex-col">
        <SectionHeader icon={SettingsIcon} title="Notifications" />
        <div className="grid grid-cols-1 gap-x-8 px-5 py-3 lg:grid-cols-2">
          <SettingsRow label="High-risk alerts" hint="Severity High alerts.">
            <SettingsToggle checked={settings.notifHighRisk} onChange={set("notifHighRisk")} label="High-risk alerts" />
          </SettingsRow>
          <SettingsRow label="Upcoming risk-zone alerts" hint="Alerts approaching the current depth.">
            <SettingsToggle checked={settings.notifUpcoming} onChange={set("notifUpcoming")} label="Upcoming risk-zone alerts" />
          </SettingsRow>
          <SettingsRow label="Historical event proximity" hint="Nearby recorded events.">
            <SettingsToggle checked={settings.notifProximity} onChange={set("notifProximity")} label="Historical event proximity" />
          </SettingsRow>
          <SettingsRow label="New supporting evidence" hint="New documents linked to active alerts.">
            <SettingsToggle checked={settings.notifEvidence} onChange={set("notifEvidence")} label="New supporting evidence" />
          </SettingsRow>
          <SettingsRow label="Report generation" hint="Completed intelligence reports.">
            <SettingsToggle checked={settings.notifReports} onChange={set("notifReports")} label="Report generation" />
          </SettingsRow>
        </div>
      </section>

      {/* Data & prototype */}
      <section className="wl-card flex flex-col">
        <SectionHeader icon={Database} title="Data & Prototype" />
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 px-5 py-4 sm:grid-cols-3 lg:grid-cols-6">
          <Kv label="Data Mode" value="Representative Prototype Data" />
          <Kv label="Region" value="Assam, India" />
          <Kv label="Wells Available" value={String(stats.wells)} />
          <Kv label="Historical Events" value={String(stats.events)} />
          <Kv label="Documents" value={String(stats.documents)} />
          <Kv label="Current Well" value={activeWellId} mono />
        </div>
        <div className="border-t border-wl-border px-5 py-3">
          <div className="rounded-[5px] border border-wl-border bg-wl-surface-2 px-4 py-3 text-[11.5px] leading-relaxed text-wl-text-secondary">
            Wellora is currently running on representative prototype data. Production deployment would
            use authorized operator datasets and validated intelligence models.
          </div>
        </div>
      </section>

      {/* About */}
      <section className="wl-card flex flex-col">
        <SectionHeader icon={FileBarChart} title="About Wellora" />
        <div className="px-5 py-4">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-[15px] font-semibold tracking-[0.14em] text-wl-text-primary">WELLORA</span>
            <span className="text-[12px] text-wl-text-secondary">Nearby Wells Intelligence</span>
          </div>
          <div className="mt-2.5 grid grid-cols-2 gap-x-6 gap-y-2.5 border-t border-wl-border pt-3 sm:grid-cols-3">
            <Kv label="Version" value="Prototype · SIH 2026" />
            <Kv label="Problem Statement" value="SIH26121" mono />
            <Kv label="Organization" value="Oil India Limited" />
          </div>
          <p className="mt-3 border-t border-wl-border pt-3 text-[12px] leading-relaxed text-wl-text-secondary">
            System purpose: convert historical drilling knowledge from nearby and comparable wells into
            evidence-backed decision support for the active well.
          </p>
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2">
        {dirty && (
          <span className="mr-auto text-[11px] text-wl-text-muted">Unsaved changes</span>
        )}
        <button type="button" className="wl-btn" onClick={() => setResetOpen(true)}>
          Reset to Defaults
        </button>
        <button
          type="button"
          className="wl-btn wl-btn-primary"
          onClick={() => {
            setSavedVisible(true);
          }}
        >
          Save Changes
        </button>
      </div>

      <ChangeWellModal
        open={wellModalOpen}
        onClose={() => setWellModalOpen(false)}
        currentWellId={activeWellId}
        onSelect={(id) => {
          setActiveWellId(id);
          setWellModalOpen(false);
        }}
      />
      <ResetConfirmDialog open={resetOpen} onClose={() => setResetOpen(false)} onReset={handleReset} />
      <SavedToast visible={savedVisible} onClose={() => setSavedVisible(false)} />
    </div>
  );
}

function ThresholdSelect({ value, onChange }) {
  return (
    <CompactSelect
      label="Alert threshold"
      value={value}
      onChange={onChange}
      options={[
        { value: "40", label: "40%" },
        { value: "50", label: "50%" },
        { value: "60", label: "60%" },
        { value: "70", label: "70%" },
        { value: "80", label: "80%" },
      ]}
    />
  );
}

function ProximitySelect({ value, onChange }) {
  return (
    <CompactSelect
      label="Proximity"
      value={value}
      onChange={onChange}
      options={[
        { value: "10", label: "10 m" },
        { value: "25", label: "25 m" },
        { value: "50", label: "50 m" },
        { value: "100", label: "100 m" },
      ]}
    />
  );
}

function Kv({ label, value, mono = false }) {
  return (
    <div>
      <div className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-wl-text-muted">
        {label}
      </div>
      <div className={`mt-0.5 text-[12.5px] text-wl-text-primary ${mono ? "tabular font-mono" : ""}`}>
        {value}
      </div>
    </div>
  );
}
