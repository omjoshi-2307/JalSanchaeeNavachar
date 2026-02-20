import React from "react";
import ReactDOM from "react-dom/client";
import HistoryDashboard from "./HistoryDashboard.jsx"; // Replaced FarmerHistory
import "./index.css";
import "leaflet/dist/leaflet.css";
import 'leaflet-draw/dist/leaflet.draw.css'

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <HistoryDashboard />
    </React.StrictMode>
);