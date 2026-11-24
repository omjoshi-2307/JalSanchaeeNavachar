import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import { useState } from 'react';
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

export default function MapView() {
  const [plots, setPlots] = useState([])

  const handleCreated = async (e) => {
    const layer = e.layer;
    const geojson = layer.toGeoJSON();

    console.log("Drawn Plot:", geojson);

    setPlots(prev => [...prev, geojson]);

    try {
      await addDoc(collection(db, "farms"), {
        polygon: JSON.stringify(geojson),
        createdAt: new Date()
      });
      console.log("Farm saved to Firebase successfully");
    } catch (error) {
      console.error("Error saving farm to firebase:", error);
    }
  }

  return (
    <MapContainer
      center={[12.9716, 77.5946]}
      zoom={13}
      zoomControl={true}
      scrollWheelZoom={true}
      style={{ height: "100vh", width: "100%" }}
      whenCreated={(map) => {
        map.on("click", (e) => {
          console.log("Clicked at:", e.latlng);
        });
      }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FeatureGroup>
        <EditControl
          position="topright"
          onCreated={handleCreated}
          draw={{
            rectangle: false,
            circle: false,
            circlemarker: false,
            marker: false,
            polyline: false
          }}
        />
      </FeatureGroup>
    </MapContainer>
  )
}

