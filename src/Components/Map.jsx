import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import styles from "./Map.module.css";

// Fix for default marker icon issue in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function Map() {
  // Coordinates for 41 Commercial Avenue, Sabo Yaba, Lagos
  const position = [6.505843, 3.379166];

  return (
    <div className={styles.mapContainer}>
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={false}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            <strong>J.OLA TORIOLA REAL ESTATE AGENCY</strong>
            <br />
            41 Commercial Avenue
            <br />
            Sabo Yaba, Lagos
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default Map;
