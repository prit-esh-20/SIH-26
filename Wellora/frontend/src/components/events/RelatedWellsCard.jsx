import { Users, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SectionHeader from "../common/SectionHeader.jsx";
import { useWellContext } from "../../context/WellContext.jsx";
import { getComparableWells } from "../../data/mockData.js";

export default function RelatedWellsCard({ wellId }) {
  const { activeWellId, setActiveWellId } = useWellContext();
  const navigate = useNavigate();

  const wells = getComparableWells(activeWellId).filter((c) => c.wellId !== wellId);

  const openWell = (wellId) => {
    setActiveWellId(wellId);
    navigate("/wells/intelligence");
  };

  return (
    <section className="wl-card flex flex-col">
      <SectionHeader
        icon={Users}
        title="Related Comparable Wells"
        actions={<span className="text-[10.5px] text-wl-text-muted">Opens Well Intelligence</span>}
      />
      <div className="flex-1 space-y-1.5 px-5 py-4">
        {wells.map((c) => (
          <button
            key={c.wellId}
            type="button"
            onClick={() => openWell(c.wellId)}
            className="flex w-full items-center gap-3 rounded-[4px] border border-transparent px-3 py-1.5 text-left transition-colors duration-100 hover:border-wl-border hover:bg-wl-surface-2"
            title={`Open ${c.wellId} in Well Intelligence`}
          >
            <span className="text-[12.5px] font-semibold text-wl-text-primary">{c.wellId}</span>
            <span className="tabular font-mono text-[11.5px] text-wl-text-secondary">{c.similarity}%</span>
            <span className="text-[10.5px] text-wl-text-muted">
              {c.events} event{c.events === 1 ? "" : "s"}
            </span>
            <ArrowRight size={12} className="ml-auto text-wl-text-muted" />
          </button>
        ))}
      </div>
    </section>
  );
}
