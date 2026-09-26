import { useEffect, useRef, useState } from "react";
import { Bell, ChevronDown, Search } from "lucide-react";
import { useWellContext } from "../../context/WellContext.jsx";
import { StatusIndicator } from "../common/StatusIndicator.jsx";
import { getWell, wells } from "../../data/mockData.js";

export default function Topbar({ title = "Dashboard" }) {
  const { activeWellId, setActiveWellId } = useWellContext();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const well = getWell(activeWellId);

  return (
    <header className="flex h-[57px] shrink-0 items-center justify-between border-b border-wl-border bg-wl-surface px-5">
      <div className="flex items-center gap-4">
        <h1 className="text-[15px] font-semibold tracking-wide">{title}</h1>
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
            className="h-8 w-full rounded-[4px] border border-wl-border bg-wl-surface-2 pl-8 pr-3 text-[12.5px] text-wl-text-primary placeholder:text-wl-text-muted focus:border-wl-border-strong"
          />
        </div>

        <div className="relative" ref={ref}>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-8 items-center gap-2 rounded-[4px] border border-wl-border bg-wl-surface-2 px-2.5 text-left transition-colors duration-100 hover:border-wl-border-strong"
          >
            <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-wl-text-muted">
              Current Well
            </span>
            <span className="text-[13px] font-semibold">{well?.id ?? "-"}</span>
            <StatusIndicator status={well?.status} blink className="scale-90" />
            <ChevronDown
              size={13}
              className={`text-wl-text-muted transition-transform duration-150 ${open ? "rotate-180" : ""}`}
            />
          </button>

          {open && (
            <div className="absolute right-0 z-[1100] mt-1.5 w-[210px] rounded-[5px] border border-wl-border-strong bg-wl-surface-2 py-1 shadow-[0_10px_30px_rgba(0,0,0,0.55)]">
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
                      ? "bg-wl-surface-3 text-wl-text-primary"
                      : "text-wl-text-secondary hover:bg-wl-surface-3 hover:text-wl-text-primary"
                  }`}
                >
                  <span className="font-medium">{w.id}</span>
                  <span className="text-[10.5px] text-wl-text-muted">{w.status}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          className="relative flex h-8 w-8 items-center justify-center rounded-[4px] border border-wl-border bg-wl-surface-2 text-wl-text-secondary transition-colors duration-100 hover:border-wl-border-strong hover:text-wl-text-primary"
          title="Notifications"
        >
          <Bell size={14} />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border border-wl-surface bg-wl-accent">
            <span className="block h-full w-full rounded-full bg-wl-accent opacity-0" />
          </span>
        </button>

        <div className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-wl-surface-3 text-[11px] font-semibold text-wl-text-secondary">
          DE
        </div>
      </div>
    </header>
  );
}
