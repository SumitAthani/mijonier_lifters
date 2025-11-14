// src/App.jsx
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import "./App.css"; // We'll add styles to this later
import MapDisplay from "./MapDisplay"; // We'll create this component next
import SoundRecorder from "./SoundRecorder";
import SpeechToText from "./SoundToText";

// --- Constants ---
const BACKEND_URL = "http://localhost:8000";
const socket = io(BACKEND_URL); // Connect to your backend

function App() {
  // --- State ---
  const [hospitals, setHospitals] = useState([]);
  const [ambulances, setAmbulances] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [isConnected, setIsConnected] = useState(socket.connected);

  // --- Data Fetching (On Load) ---
  useEffect(() => {
    // 1. Fetch initial dashboard data
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/mcao/dashboard`);
        const data = response.data;
        setHospitals(data.hospitals || []);
        setAmbulances(data.ambulances || []);
        setIncidents(data.incidents || []);
        setAssignments(data.assignments || []);
        console.log("Dashboard data loaded:", data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []); // Empty array means this runs once on component mount

  // --- Socket.io Listeners ---
  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
      console.log("Socket.io connected");
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      console.log("Socket.io disconnected");
    });

    // Listen for hospital capacity updates from the "heartbeat"
    socket.on("hospital_update", (updatedHospitals) => {
      console.log("Received hospital update");
      setHospitals(updatedHospitals);
    });

    // Listen for new assignments from the orchestrator
    socket.on("new_assignments", (newAssignmentData) => {
      console.log("Received new assignments:", newAssignmentData);
      // Add new assignments to our list
      setAssignments((prev) => [...prev, ...newAssignmentData]);

      // We also need to update the ambulance/hospital state locally
      // (This re-fetches everything for simplicity)
      axios.get(`${BACKEND_URL}/api/mcao/dashboard`).then((res) => {
        setHospitals(res.data.hospitals || []);
        setAmbulances(res.data.ambulances || []);
      });
    });

    // Cleanup function
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("hospital_update");
      socket.off("new_assignments");
    };
  }, []); // Run this effect once

  // --- Helper Functions ---

  // This function simulates a new incident
  const createTestIncident = async () => {
    console.log("Creating test incident...");
    try {
      const incidentData = {
        lat: 40.751,
        lng: -73.989,
        severity: "high",
        patient_count: 3,
      };
      const response = await axios.post(
        `${BACKEND_URL}/api/mcao/incident`,
        incidentData
      );
      console.log("Incident created:", response.data);
      // The socket event will handle the UI update
    } catch (error) {
      console.error("Error creating incident:", error);
    }
  };

  // This seeds the database (for testing)
  const seedDatabase = async () => {
    try {
      await axios.get(`${BACKEND_URL}/api/mcao/seed`);
      alert("Database seeded! Refreshing data...");
      // Re-fetch dashboard
      const response = await axios.get(`${BACKEND_URL}/api/mcao/dashboard`);
      setHospitals(response.data.hospitals || []);
      setAmbulances(response.data.ambulances || []);
      setIncidents(response.data.incidents || []);
      setAssignments(response.data.assignments || []);
    } catch (error) {
      console.error("Error seeding database:", error);
    }
  };

  return (
    <div className="app-container">
      {/* --- Header --- */}
      <header className="app-header">
        <h1>Mass-Casualty Ambulance Orchestrator (MCAO)</h1>
        <div className="status-bar">
          <span
            className={`connection-status ${
              isConnected ? "connected" : "disconnected"
            }`}
          >
            {isConnected ? "● Connected" : "● Disconnected"}
          </span>
          <button onClick={seedDatabase}>Seed Database</button>
          <button onClick={createTestIncident}>Create Test Incident</button>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="main-content">
        {/* We'll pass all our state down to the map */}
        <MapDisplay
          hospitals={hospitals}
          ambulances={ambulances}
          incidents={incidents}
          assignments={assignments}
        />

        {/* A simple list to see assignments */}
        <div className="sidebar">
          <h2>Assignments</h2>
          <div className="assignment-list">
            {assignments.length === 0 && <p>No active assignments.</p>}
            {assignments.map((a) => (
              <div key={a._id} className="assignment-card">
                <p>
                  <strong>Ambulance:</strong> {a.ambulance?.vehicle_id || "N/A"}
                </p>
                <p>
                  <strong>Hospital:</strong> {a.hospital?.name || "N/A"}
                </p>
                <p>
                  <strong>ETA:</strong> {a.eta_minutes} mins
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
