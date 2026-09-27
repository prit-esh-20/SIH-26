import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Bell, ChevronDown, Search } from "lucide-react";
import { useWellContext } from "../../context/WellContext.jsx";
import { StatusDot } from "../common/StatusIndicator.jsx";
import { getWell, wells } from "../../data/mockData.js";

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/wells/intelligence": "Well Intelligence",
  "/map": "Map",
  "/events": "Historical Events",
  "/documents": "Documents",
  "/alerts": "Alerts",
  "/reports": "Reports",
  "/settings": "Settings",
};

export default function Topbar({ title }) {
  const { activeWellId, setActiveWellId } = useWellContext();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { pathname } = useLocation();
  const pageTitle = title ?? PAGE_TITLES[pathname] ?? "Wellora";

  useEffect(() => {
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const well = getWell(activeWellId);

  return (
    <header className="flex h-[60px] shrink-0 items-center justify-between border-b border-wl-border bg-wl-surface px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-[15px] font-semibold tracking-wide">{pageTitle}</h1>
        <span className="h-4 w-px bg-wl-border" />
        <span className="text-xs text-wl-text-muted">
          Nearby wells intelligence for the active well
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-[300px]">
          <Search
            size={13}
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-wl-text-muted"
          />
          <input
            type="text"
            placeholder="Search wells, events, formations..."
            className="h-8 w-full rounded-[6px] border border-wl-border bg-wl-surface pl-8 pr-3 text-[12.5px] text-wl-text-primary placeholder:text-wl-text-muted transition-colors duration-100 focus:border-wl-accent"
          />
        </div>

        <div className="relative" ref={ref}>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-8 items-center gap-2 rounded-[6px] border border-wl-border bg-wl-surface px-3 text-left transition-colors duration-100 hover:border-wl-border-strong"
          >
            <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-wl-text-muted">
              Current Well
            </span>
            <span className="text-[13px] font-semibold text-wl-accent-dark">
              {well?.id ?? "-"}
            </span>
            <StatusDot status={well?.status} blink />
            <ChevronDown
              size={13}
              className={`text-wl-text-muted transition-transform duration-150 ${open ? "rotate-180" : ""}`}
            />
          </button>

          {open && (
            <div className="absolute right-0 z-[1100] mt-1.5 w-[220px] rounded-[6px] border border-wl-border bg-wl-surface py-1 shadow-[0_10px_30px_rgba(23,32,29,0.14)]">
              <div className="px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-wl-text-muted">
                Select active well
              </div>
              {wells.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => {
                    setActiveWellId(w.id);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-3 py-1.5 text-[12.5px] transition-colors duration-100 ${
                    w.id === activeWellId
                      ? "bg-wl-accent-light text-wl-text-primary"
                      : "text-wl-text-secondary hover:bg-wl-surface-2 hover:text-wl-text-primary"
                  }`}
                >
                  <span className={`font-medium ${w.id === activeWellId ? "text-wl-accent-dark" : ""}`}>
                    {w.id}
                  </span>
                  <span className="text-[10.5px] text-wl-text-muted">{w.status}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          className="relative flex h-8 w-8 items-center justify-center rounded-[6px] border border-wl-border bg-wl-surface text-wl-text-secondary transition-colors duration-100 hover:border-wl-border-strong hover:text-wl-text-primary"
          title="Notifications"
        >
          <Bell size={14} />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border-2 border-wl-surface bg-wl-accent" />
        </button>

        <div className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-wl-surface-2 text-[11px] font-semibold text-wl-text-secondary">
          DE
        </div>
      </div>
    </header>
  );
}
