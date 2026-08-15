import {
  LayoutDashboard,
  Building2,
  ShieldAlert,
  Activity,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navigationItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Organization",
    path: "/organization",
    icon: Building2,
  },
  {
    label: "Attack Simulation",
    path: "/simulation",
    icon: ShieldAlert,
  },
  {
    label: "Risk Analysis",
    path: "/risk",
    icon: Activity,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <ShieldCheck size={22} />
        </div>

        <div>
          <div className="brand-name">CyberTwin</div>
          <div className="brand-subtitle">Cyber Risk Platform</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">PLATFORM</div>

        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="system-status">
          <span className="status-dot" />
          <span>System Operational</span>
        </div>

        <div className="sidebar-version">CyberTwin v0.1.0</div>
      </div>
    </aside>
  );
}

export default Sidebar;