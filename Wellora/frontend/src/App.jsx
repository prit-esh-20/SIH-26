import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import WellIntelligence from "./pages/WellIntelligence.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/wells/intelligence" element={<WellIntelligence />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
