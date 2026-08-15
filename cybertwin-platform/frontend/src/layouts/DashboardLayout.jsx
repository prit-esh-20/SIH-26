import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/navigation/Sidebar";
import Header from "../components/navigation/Header";

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="app-main">
        <Header onMenuClick={() => setSidebarOpen((v) => !v)} />

        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
