import { MapContainer, TileLayer } from "react-leaflet";

export default function VillageMap() {
    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <MapContainer
                center={[19.076, 72.8777]} // Mumbai (you can change later)
                zoom={13}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </MapContainer>
        </div>
    );
}