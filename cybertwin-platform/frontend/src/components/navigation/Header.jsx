import { Bell, Menu, Search, ShieldCheck } from "lucide-react";

function Header({ onMenuClick }) {
  return (
    <header className="header">
      <div className="header-left">
        <button
          type="button"
          className="header-menu-button"
          onClick={onMenuClick}
          aria-label="Toggle navigation menu"
        >
          <Menu size={18} />
        </button>

        <div className="header-mobile-brand">
          <ShieldCheck size={16} />
          CyberTwin
        </div>

        <div className="search-box">
          <Search size={17} aria-hidden="true" />
          <input
            type="search"
            placeholder="Search organization, assets, users..."
            aria-label="Search"
          />
        </div>
      </div>

      <div className="header-right">
        <button className="header-icon-button" aria-label="Notifications">
          <Bell size={18} />
          <span className="notification-dot" />
        </button>

        <div className="header-divider" aria-hidden="true" />

        <button className="user-menu" aria-label="User menu">
          <div className="user-avatar">AD</div>

          <div className="user-info">
            <span className="user-name">Admin</span>
            <span className="user-role">Security Analyst</span>
          </div>
        </button>
      </div>
    </header>
  );
}

export default Header;
