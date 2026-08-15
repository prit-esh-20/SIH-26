import { Outlet } from "react-router-dom";

import Sidebar from "../components/navigation/Sidebar";
import Header from "../components/navigation/Header";

function DashboardLayout() {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="app-main">
        <Header />

        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;