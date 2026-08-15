import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import "./App.css";
import "./components/common/common.css";
import "./components/navigation/Navigation.css";
import "./components/dashboard/dashboard.css";
import "./components/simulation/simulation.css";
import "./components/risk/risk.css";
import "./pages/Organization.css";
import "./pages/Settings.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
