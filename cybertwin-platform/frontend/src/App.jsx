import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Organization = lazy(() => import("./pages/Organization"));
const AttackSimulation = lazy(() => import("./pages/AttackSimulation"));
const RiskAnalysis = lazy(() => import("./pages/RiskAnalysis"));
const Settings = lazy(() => import("./pages/Settings"));

function PageLoader() {
  return (
    <div className="page" aria-busy="true" aria-label="Loading page">
      <div className="skeleton skeleton-line skeleton-line--w40" />
      <div className="card">
        <div className="skeleton skeleton-card" />
      </div>
      <div className="section-grid grid-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div className="card" key={i}>
            <div className="skeleton skeleton-card" />
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/organization" element={<Organization />} />
          <Route path="/simulation" element={<AttackSimulation />} />
          <Route path="/risk" element={<RiskAnalysis />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
