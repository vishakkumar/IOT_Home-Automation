import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import DeviceSelectionPage from "./components/DeviceSelectionPage";
import DashboardPage from "./components/DashboardPage";
import ControlPage from "./components/ControlPage";
import { useLocation } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/device-selection" element={<DeviceSelectionPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/control-panel" element={<ControlPageWrapper />} />
      </Routes>
    </Router>
  );
};

const ControlPageWrapper = () => {
  const location = useLocation();
  const categories = location.state?.categories || [];
  return <ControlPage categories={categories} />;
};

export default App;
