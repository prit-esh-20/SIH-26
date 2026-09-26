import { NavLink } from "react-router-dom";
import {
  Activity,
  Bell,
  Database,
  FileBarChart,
  FileText,
  Layers,
  Map,
  Settings,
} from "lucide-react";
import { WelloraLogo } from "../brand/WelloraLogo.jsx";

function NavItem({ to, icon: Icon, label, disabled = false, end = false }) {
  if (disabled) {
    return (
      <div
        title="Module under development"
        className="flex cursor-default items-center gap-2.5 rounded-[4px] px-3 py-[7px] text-[13px] font-medium text-wl-text-muted/70"
      >
        <Icon size={15} strokeWidth={1.8} />
        <span className="flex-1">{label}</span>
      </div>
    );
  }

  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `relative flex items-center gap-2.5 rounded-[4px] px-3 py-[7px] text-[13px] font-medium transition-colors duration-100 ${
          isActive
            ? "bg-wl-accent-light text-wl-text-primary"
            : "text-wl-text-secondary hover:bg-wl-surface-2 hover:text-wl-text-primary"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span
              aria-hidden="true"
              className="absolute left-0 top-1/2 h-[18px] w-[3px] -translate-y-1/2 rounded-r-full bg-wl-accent"
            />
          )}
          <Icon
            size={15}
            strokeWidth={1.8}
            className={isActive ? "text-wl-accent" : ""}
          />
          <span className="flex-1">{label}</span>
        </>
      )}
    </NavLink>
  );
}

function NavGroup({ label, children }) {
  return (
    <div className="mt-4">
      <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-wl-text-muted">
        {label}
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

export default function Sidebar() {
  return (
    <aside className="flex h-full w-[228px] shrink-0 flex-col border-r border-wl-border bg-wl-surface">
      <div className="flex h-[60px] items-center border-b border-wl-border px-4">
        <WelloraLogo />
      </div>

      <nav className="flex-1 overflow-y-auto px-2.5 py-3">
        <NavItem to="/dashboard" icon={Activity} label="Overview" end />

        <NavGroup label="Wells">
          <NavItem to="/wells/intelligence" icon={Layers} label="Well Intelligence" />
        </NavGroup>

        <div className="mt-4">
          <NavItem to="/map" icon={Map} label="Map" disabled />
        </div>

        <NavGroup label="Knowledge">
          <NavItem to="/knowledge/documents" icon={FileText} label="Documents" disabled />
          <NavItem to="/knowledge/events" icon={Database} label="Historical Events" disabled />
        </NavGroup>

        <div className="mt-4">
          <NavItem to="/alerts" icon={Bell} label="Alerts" disabled />
        </div>

        <div className="mt-4">
          <NavItem to="/reports" icon={FileBarChart} label="Reports" disabled />
        </div>
      </nav>

      <div className="border-t border-wl-border px-2.5 py-3">
        <NavItem to="/settings" icon={Settings} label="Settings" disabled />
        <div className="mt-1 flex items-center gap-2.5 rounded-[4px] px-3 py-[7px] text-[13px] font-medium text-wl-text-secondary">
          <span className="flex h-6 w-6 items-center justify-center rounded-[3px] bg-wl-accent-light text-[10px] font-semibold text-wl-accent-dark">
            DE
          </span>
          <span>Drill Engineer</span>
        </div>
        <div className="mt-3 border-t border-wl-border/70 px-3 pt-2.5 text-[9px] leading-relaxed tracking-wide text-wl-text-muted">
          WELLORA · NWIS
          <br />
          SIH 2026 · SIH26121
        </div>
      </div>
    </aside>
  );
}
