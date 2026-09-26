import { NavLink } from "react-router-dom";
import {
  Activity,
  Bell,
  Database,
  FileText,
  Layers,
  Map,
  Settings,
  User,
} from "lucide-react";
import { WelloraLogo } from "../brand/WelloraLogo.jsx";

function NavItem({ to, icon: Icon, label, placeholder = false, end = false }) {
  const inner = (
    <>
      <Icon size={15} strokeWidth={1.8} />
      <span className="flex-1">{label}</span>
      {placeholder && (
        <span className="text-[9px] font-medium uppercase tracking-wider text-wl-text-muted/70">
          Soon
        </span>
      )}
    </>
  );

  if (placeholder) {
    return (
      <div
        title="Module planned for a later phase"
        className="flex cursor-default items-center gap-2.5 rounded-[4px] px-3 py-[7px] text-[13px] font-medium text-wl-text-muted/80"
      >
        {inner}
      </div>
    );
  }

  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-2.5 rounded-[4px] px-3 py-[7px] text-[13px] font-medium transition-colors duration-100 ${
          isActive
            ? "bg-wl-surface-3 text-wl-text-primary shadow-[inset_2px_0_0_0_var(--color-wl-accent)]"
            : "text-wl-text-secondary hover:bg-wl-surface-2 hover:text-wl-text-primary"
        }`
      }
    >
      {inner}
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
      <div className="flex h-[57px] items-center border-b border-wl-border px-4">
        <WelloraLogo />
      </div>

      <nav className="flex-1 overflow-y-auto px-2.5 py-3">
        <NavItem to="/dashboard" icon={Activity} label="Overview" end />

        <NavGroup label="Wells">
          <NavItem
            to="/wells/intelligence"
            icon={Layers}
            label="Well Intelligence"
            placeholder
          />
        </NavGroup>

        <div className="mt-4">
          <NavItem to="/map" icon={Map} label="Map" placeholder />
        </div>

        <NavGroup label="Knowledge">
          <NavItem to="/knowledge/documents" icon={FileText} label="Documents" placeholder />
          <NavItem
            to="/knowledge/events"
            icon={Database}
            label="Historical Events"
            placeholder
          />
        </NavGroup>

        <div className="mt-4">
          <NavItem to="/alerts" icon={Bell} label="Alerts" placeholder />
        </div>

        <div className="mt-4">
          <NavItem to="/reports" icon={FileText} label="Reports" placeholder />
        </div>
      </nav>

      <div className="border-t border-wl-border px-2.5 py-3">
        <NavItem to="/settings" icon={Settings} label="Settings" placeholder />
        <div className="mt-1 flex items-center gap-2.5 rounded-[4px] px-3 py-[7px] text-[13px] font-medium text-wl-text-secondary">
          <span className="flex h-6 w-6 items-center justify-center rounded-[3px] bg-wl-surface-3 text-[10px] font-semibold text-wl-text-secondary">
            DE
          </span>
          <span>Drill Engineer</span>
        </div>
        <div className="mt-3 border-t border-wl-border/60 px-3 pt-2.5 text-[9px] leading-relaxed tracking-wide text-wl-text-muted">
          WELLORA · NWIS
          <br />
          SIH 2026 · SIH26121
        </div>
      </div>
    </aside>
  );
}
