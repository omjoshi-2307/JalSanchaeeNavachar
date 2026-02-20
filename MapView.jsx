// src/MapView.jsx
import { useState } from "react";
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { db } from "./firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";


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
            console.log("Attempting to update specific document Hg3Fk1cRg5WDwTcc5DiZ...");

            // Reference the specific document
            const specificDocRef = doc(db, "farms", "Hg3Fk1cRg5WDwTcc5DiZ");

            // Update the document by adding the new polygon to a 'polygons' array field
            // If the field doesn't exist, it will be created.
            await updateDoc(specificDocRef, {
                polygons: arrayUnion({
                    id: Date.now(),
                    // Firestore cannot store nested arrays (like GeoJSON coordinates [[x,y]]), so we stringify it
                    geometry: JSON.stringify(geojson.geometry),
                    properties: geojson.properties,
                    createdAt: new Date().toISOString()
                })
            });
            console.log("Polygon added to document Hg3Fk1cRg5WDwTcc5DiZ successfully");
        } catch (error) {
            console.error("Error updating document:", error);
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