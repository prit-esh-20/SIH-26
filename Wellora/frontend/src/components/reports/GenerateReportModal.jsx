import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, FileBarChart, X } from "lucide-react";
import { reportTitleForType, reportTypes } from "../../data/mockData.js";

export default function GenerateReportModal({ open, onClose, onGenerate, wellId = "W-205" }) {
  const [type, setType] = useState(reportTypes[0]);
  const [depthContext, setDepthContext] = useState("current");
  const [evidence, setEvidence] = useState({
    events: true,
    wells: true,
    documents: true,
    alerts: true,
  });

  const toggleEvidence = (key) => setEvidence((e) => ({ ...e, [key]: !e[key] }));
  const canGenerate = Object.values(evidence).some(Boolean);

  const handleGenerate = () => {
    const report = {
      id: `RPT-${Date.now()}`,
      title: reportTitleForType(type, wellId),
      type,
      wellId,
      depth: 2860,
      formation: "F3",
      generated: "2026-09-27",
      status: "Ready",
      evidenceEventIds: [],
      sourceDocumentIds: [],
      fresh: true,
    };
    onGenerate(report);
  };

  const evidenceOptions = [
    { key: "events", label: "Historical events" },
    { key: "wells", label: "Comparable wells" },
    { key: "documents", label: "Source documents" },
    { key: "alerts", label: "Active alerts" },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[1400] flex items-center justify-center bg-[#17201D]/35 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ type: "tween", duration: 0.18, ease: "easeOut" }}
            className="w-[440px] max-w-full rounded-[6px] border border-wl-border-strong bg-wl-surface shadow-[0_16px_40px_rgba(23,32,29,0.18)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-[52px] items-center justify-between border-b border-wl-border px-5">
              <div className="wl-panel-title">
                <FileBarChart size={13} />
                <span>Generate Report</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-7 w-7 items-center justify-center rounded-[4px] border border-wl-border text-wl-text-muted transition-colors duration-100 hover:border-wl-border-strong hover:text-wl-text-primary"
                title="Close"
              >
                <X size={14} />
              </button>
            </div>

            <div className="space-y-4 px-5 py-4">
              <ModalField label="Well">
                <div className="font-mono text-[13px] font-semibold text-wl-text-primary">{wellId}</div>
              </ModalField>

              <ModalField label="Report Type">
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="h-8 w-full rounded-[5px] border border-wl-border bg-wl-surface px-2.5 text-[12px] text-wl-text-primary focus:border-wl-accent"
                >
                  {reportTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </ModalField>

              <ModalField label="Depth Context">
                <select
                  value={depthContext}
                  onChange={(e) => setDepthContext(e.target.value)}
                  className="h-8 w-full rounded-[5px] border border-wl-border bg-wl-surface px-2.5 text-[12px] text-wl-text-primary focus:border-wl-accent"
                >
                  <option value="current">Current interval (2,860 - 2,950 m)</option>
                  <option value="full">Full F3 interval (2,740 - 3,120 m)</option>
                </select>
              </ModalField>

              <ModalField label="Evidence">
                <div className="space-y-1.5">
                  {evidenceOptions.map((o) => (
                    <label key={o.key} className="flex cursor-pointer items-center gap-2 text-[12px]">
                      <input
                        type="checkbox"
                        checked={evidence[o.key]}
                        onChange={() => toggleEvidence(o.key)}
                        className="h-3.5 w-3.5 accent-[#E8751A]"
                      />
                      <span className="text-wl-text-primary">{o.label}</span>
                    </label>
                  ))}
                </div>
              </ModalField>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-wl-border px-5 py-3.5">
              <button type="button" className="wl-btn" onClick={onClose}>
                Cancel
              </button>
              <button
                type="button"
                className="wl-btn wl-btn-primary"
                disabled={!canGenerate}
                style={canGenerate ? undefined : { opacity: 0.5, cursor: "not-allowed" }}
                onClick={handleGenerate}
              >
                Generate Report
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function GenerateSuccessToast({ report, onClose }) {
  return (
    <AnimatePresence>
      {report && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ type: "tween", duration: 0.18 }}
          className="fixed bottom-6 right-6 z-[1500] flex items-start gap-3 rounded-[6px] border border-wl-border-strong bg-wl-surface px-4 py-3.5 shadow-[0_16px_40px_rgba(23,32,29,0.18)]"
        >
          <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#3f7d55]" />
          <div className="pr-4">
            <div className="text-[12.5px] font-semibold text-wl-text-primary">Report generated</div>
            <div className="mt-0.5 text-[12px] text-wl-text-secondary">{report.title}</div>
            <div className="mt-0.5 text-[11px] text-wl-text-muted">Ready for review.</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded-[4px] border border-wl-border text-wl-text-muted transition-colors duration-100 hover:border-wl-border-strong hover:text-wl-text-primary"
            title="Dismiss"
          >
            <X size={12} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ModalField({ label, children }) {
  return (
    <div>
      <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-wl-text-muted">
        {label}
      </div>
      {children}
    </div>
  );
}
