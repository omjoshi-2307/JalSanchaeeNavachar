// src/MapView.jsx
import { useState } from "react";
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

export default function MapView() {
    const [plots, setPlots] = useState([]);

    // This function runs every time a polygon is drawn
    const handleCreated = async (e) => {
        const layer = e.layer;
        const geojson = layer.toGeoJSON();

        console.log("Drawn plot:", geojson); // shows polygon in browser console
        setPlots((prev) => [...prev, geojson]);

        try {
            await addDoc(collection(db, "forms"), {
                polygon: JSON.stringify(geojson),
                createdAt: new Date()
            });
            console.log("Farm saved to Firebase successfully"); // confirms save
        } catch (error) {
            console.error("Error saving to Firebase:", error);
        }
    };

    return (
        <MapContainer
            center={[12.9716, 77.5946]} // change to your village coordinates
            zoom={15}
            style={{ height: "100vh", width: "100%" }}
            zoomControl={true}
            scrollWheelZoom={true}
        >
            <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <FeatureGroup>
                <EditControl
                    position="topright"
                    onCreated={handleCreated} // ✅ important
                    draw={{
                        rectangle: false,
                        circle: false,
                        circlemarker: false,
                        marker: false,
                        polyline: false,
                    }}
                />
            </FeatureGroup>
        </MapContainer>
    );
}