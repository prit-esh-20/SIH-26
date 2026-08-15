import { Bell, ChevronDown, Search } from "lucide-react";

function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <div className="search-box">
          <Search size={17} />
          <input
            type="text"
            placeholder="Search organization, assets, users..."
          />
        </div>
      </div>

      <div className="header-right">
        <button className="header-icon-button" aria-label="Notifications">
          <Bell size={18} />
          <span className="notification-dot" />
        </button>

        <div className="header-divider" />

        <button className="user-menu">
          <div className="user-avatar">AD</div>

          <div className="user-info">
            <span className="user-name">Admin</span>
            <span className="user-role">Security Analyst</span>
          </div>

          <ChevronDown size={16} />
        </button>
      </div>
    </header>
  );
}

export default Header;