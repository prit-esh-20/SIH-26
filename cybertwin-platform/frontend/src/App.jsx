import { Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";

import Dashboard from "./pages/Dashboard";
import Organization from "./pages/Organization";
import AttackSimulation from "./pages/AttackSimulation";
import RiskAnalysis from "./pages/RiskAnalysis";
import Settings from "./pages/Settings";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/organization" element={<Organization />} />
        <Route path="/simulation" element={<AttackSimulation />} />
        <Route path="/risk" element={<RiskAnalysis />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;