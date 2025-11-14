// src/MapDisplay.jsx
import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";

// --- Custom Icons (Hack to fix default Leaflet icon issues) ---
// We'll just use simple text icons for the demo
const createIcon = (text) => {
  return L.divIcon({
    html: `<div class="map-icon">${text}</div>`,
    className: "map-icon-container",
    iconSize: [40, 40],
    iconAnchor: [20, 40], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -40], // point from which the popup should open
  });
};

const hospitalIcon = createIcon("🏥"); // Hospital emoji
const ambulanceIcon = createIcon("🚑"); // Ambulance emoji
const incidentIcon = createIcon("🔥"); // Incident emoji
// --- End Custom Icons ---

function MapDisplay({ hospitals, ambulances, incidents, assignments }) {
  // Leaflet expects [lat, lng], but Mongo uses [lng, lat]. We must flip them!
  const flipCoords = (coords) => [coords[1], coords[0]];

  const mapCenter = [40.748, -73.985]; // Center on NYC (our mock data)
  const defaultZoom = 14;

  return (
    <MapContainer
      center={mapCenter}
      zoom={defaultZoom}
      style={{ height: "100%", width: "100%" }}
    >
      {/* Base map layer */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />

      {/* --- Render Hospitals --- */}
      {hospitals.map((hospital) => {
        console.log("🚀 ~ MapDisplay ~ hospital:", hospital);
        return (
          <Marker
            key={hospital._id}
            position={flipCoords(hospital.location.coordinates)}
            icon={hospitalIcon}
          >
            <Popup>
              <strong>{hospital.name}</strong>
              <br />
              Capabilities: {hospital.capabilities.join(", ")}
              <br />
              <strong>
                ER Beds Free: {hospital.free_er_beds} / {hospital.total_er_beds}
              </strong>
            </Popup>
          </Marker>
        );
      })}

      {/* --- Render Ambulances --- */}
      {ambulances.map((amb) => (
        <Marker
          key={amb._id}
          position={flipCoords(amb.location.coordinates)}
          icon={ambulanceIcon}
        >
          <Popup>
            <strong>{amb.vehicle_id}</strong>
            <br />
            Status: {amb.status}
            <br />
            Equipment: {amb.equipment}
          </Popup>
        </Marker>
      ))}

      {/* --- Render Incidents --- */}
      {incidents.map((inc) => (
        <Marker
          key={inc._id}
          position={flipCoords(inc.location.coordinates)}
          icon={incidentIcon}
        >
          <Popup>
            <strong>Incident</strong>
            <br />
            Patients: {inc.patient_count}
            <br />
            Severity: {inc.severity}
          </Popup>
        </Marker>
      ))}

      {/* --- Render Assignment Polylines --- */}
      {assignments.map((a) => {
        // Ensure we have all the data to draw a line
        if (!a.ambulance || !a.hospital) return null;

        const ambPos = flipCoords(a.ambulance.location.coordinates);
        const hospPos = flipCoords(a.hospital.location.coordinates);

        return (
          <Polyline
            key={a._id}
            positions={[ambPos, hospPos]}
            color="red"
            weight={4}
            opacity={0.8}
            dashArray="6, 8"
          />
        );
      })}
    </MapContainer>
  );
}

export default MapDisplay;
