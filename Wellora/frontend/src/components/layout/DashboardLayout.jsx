import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import Watermark from "../brand/Watermark.jsx";
import { WellProvider } from "../../context/WellContext.jsx";

export default function DashboardLayout() {
  return (
    <WellProvider>
      <div className="flex h-screen overflow-hidden bg-wl-bg">
        <Sidebar />
        <div className="relative flex min-w-0 flex-1 flex-col">
          <Topbar />
          <main className="relative flex-1 overflow-y-auto">
            <Watermark />
            <div className="relative z-10 px-6 py-5">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </WellProvider>
  );
}
