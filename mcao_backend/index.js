// --- Core Dependencies ---
import express from "express";
import http from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import "dotenv/config";

export function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType,
    },
  };
}
// --- App Setup ---
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors({ origin: "*" })); // Allow all origins for the hackathon

const server = http.createServer(app);
const PORT = process.env.PORT || 4000;

// --- Database & Cache Config ---
const MONGO_URI =
  "mongodb+srv://nikhilg1098:Nikhil5612@cluster0.qq5lgfj.mongodb.net/?retryWrites=true&w=majority";

// --- Socket.io Setup ---
const io = new Server(server, {
  cors: {
    origin: "*", // Allow any origin
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

const upload = multer({ dest: "uploads/" });

app.post(
  "/process-casualty-report",
  upload.single("audioFile"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).send("No audio file uploaded.");
    }

    try {
    } catch (error) {
      console.error("Error processing casualty report:", error);
      res.status(500).send("Error processing request.");
    }
  }
);

// ===========================================
// --- 1. Mongoose Schemas & Models ---
// ===========================================

// Hospital Model
const hospitalSchema = new mongoose.Schema(
  {
    name: String,
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },
    capabilities: [String], // ['trauma', 'cardiac', 'general']
    // --- Real-time data ---
    // We store this directly in Mongo for simplicity
    free_er_beds: { type: Number, default: 0 },
    free_icu_beds: { type: Number, default: 0 },
    total_er_beds: { type: Number, default: 10 },
    total_icu_beds: { type: Number, default: 5 },
  },
  { timestamps: true }
);

// Create a 2dsphere index for geospatial queries
hospitalSchema.index({ location: "2dsphere" });
const Hospital = mongoose.model("Hospital", hospitalSchema);

// Ambulance Model
const ambulanceSchema = new mongoose.Schema(
  {
    vehicle_id: { type: String, unique: true, required: true },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },
    status: {
      type: String,
      enum: ["available", "assigned", "enroute", "at_hospital"],
      default: "available",
    },
    equipment: { type: String, enum: ["BLS", "ALS"], default: "ALS" },
  },
  { timestamps: true }
);

ambulanceSchema.index({ location: "2dsphere" });
const Ambulance = mongoose.model("Ambulance", ambulanceSchema);

// Incident Model
const incidentSchema = new mongoose.Schema(
  {
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },
    severity: String, // 'high', 'medium', 'low'
    patient_count: Number,
    status: { type: String, enum: ["active", "closed"], default: "active" },
  },
  { timestamps: true }
);
const Incident = mongoose.model("Incident", incidentSchema);

// Assignment Model (to track decisions)
const assignmentSchema = new mongoose.Schema(
  {
    incident: { type: mongoose.Schema.Types.ObjectId, ref: "Incident" },
    ambulance: { type: mongoose.Schema.Types.ObjectId, ref: "Ambulance" },
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital" },
    eta_minutes: Number,
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);
const Assignment = mongoose.model("Assignment", assignmentSchema);

// ===========================================
// --- 2. Mocking & Helper Functions ---
// ===========================================

/**
 * MOCK ROUTING API
 * Calculates a "mock" ETA in minutes based on distance.
 * In a real app, this would call Mapbox or OSRM.
 */
function getMockETA(loc1, loc2) {
  // loc1, loc2 are [lng, lat] arrays
  const [lng1, lat1] = loc1;
  const [lng2, lat2] = loc2;
  // Simple Euclidean distance (not accurate, but fast)
  const dist = Math.sqrt(Math.pow(lng1 - lng2, 2) + Math.pow(lat1 - lat2, 2));
  // Convert distance to "minutes" (tune this factor)
  const etaMinutes = Math.floor(dist * 100) + 5; // Base 5 min + distance factor
  return etaMinutes;
}

// helper: haversine distance in kilometers
function haversineKm([lng1, lat1], [lng2, lat2]) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371; // Earth's radius km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// estimate minutes from distance (km) assuming average speed (km/h)
function minutesFromKm(km, avgKmph = 40) {
  // avoid division by zero; clamp a plausible minimum speed
  const speed = Math.max(avgKmph, 5);
  const hours = km / speed;
  return Math.max(1, Math.round(hours * 60));
}

// compute total ETA (ambulance -> incident -> hospital) in minutes
function computeTotalETA(ambulanceCoords, incidentCoords, hospitalCoords) {
  // coords are [lng, lat]
  const ambToIncidentKm = haversineKm(ambulanceCoords, incidentCoords);
  const incidentToHospitalKm = haversineKm(incidentCoords, hospitalCoords);

  // Use different expected speeds:
  // while ambulance en-route to scene it may be faster (use lights/siren speed)
  const ambSpeedKmph = 50; // tune per city
  const postPickupSpeedKmph = 40; // to hospital

  const t1 = minutesFromKm(ambToIncidentKm, ambSpeedKmph);
  const t2 = minutesFromKm(incidentToHospitalKm, postPickupSpeedKmph);

  // add a small fixed handling time at scene (stabilization/boarding)
  const onSceneMinutes = 4;

  return t1 + onSceneMinutes + t2;
}

// ===========================================
// --- 3. Core API Routes ---
// ===========================================

/**
 * GET /api/seed
 * (Hackathon only!) Populates the database with mock data.
 */
app.get("/api/seed", async (req, res) => {
  try {
    console.log("[API] Seeding database...");
    // Clear old data
    await Hospital.deleteMany({});
    await Ambulance.deleteMany({});
    await Incident.deleteMany({});
    await Assignment.deleteMany({});

    // Create Hospitals
    const hospitalA = await Hospital.create({
      name: "Mercy General",
      location: { coordinates: [-73.985, 40.748] }, // [lng, lat]
      capabilities: ["trauma", "cardiac"],
      free_er_beds: 5,
      total_er_beds: 10,
      free_icu_beds: 2,
      total_icu_beds: 5,
    });

    const hospitalB = await Hospital.create({
      name: "Downtown Medical",
      location: { coordinates: [-73.99, 40.75] },
      capabilities: ["general", "pediatric"],
      free_er_beds: 8,
      total_er_beds: 8,
      free_icu_beds: 1,
      total_icu_beds: 2,
    });

    const hospitalC = await Hospital.create({
      name: "St. Jude's",
      location: { coordinates: [-73.98, 40.745] },
      capabilities: ["general"],
      free_er_beds: 3,
      total_er_beds: 5,
      free_icu_beds: 0,
      total_icu_beds: 1,
    });

    // Create Ambulances
    await Ambulance.create([
      {
        vehicle_id: "AMB-001",
        location: { coordinates: [-73.988, 40.749] },
        status: "available",
        equipment: "ALS",
      },
      {
        vehicle_id: "AMB-002",
        location: { coordinates: [-73.982, 40.747] },
        status: "available",
        equipment: "ALS",
      },
      {
        vehicle_id: "AMB-003",
        location: { coordinates: [-73.985, 40.745] },
        status: "available",
        equipment: "BLS",
      },
      {
        vehicle_id: "AMB-004",
        location: { coordinates: [-73.991, 40.752] },
        status: "available",
        equipment: "ALS",
      },
    ]);

    console.log("[API] Seed complete!");
    res.json({
      message: "Database seeded successfully!",
      hospitals: [hospitalA, hospitalB, hospitalC],
      ambulances: await Ambulance.find(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/dashboard
 * Returns the current state of all assets.
 */
app.get("/api/dashboard", async (req, res) => {
  try {
    const [hospitals, ambulances, incidents, assignments] = await Promise.all([
      Hospital.find(),
      Ambulance.find(),
      Incident.find({ status: "active" }),
      Assignment.find({ status: "pending" }).populate(
        "hospital ambulance incident"
      ),
    ]);
    res.json({ hospitals, ambulances, incidents, assignments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/incident
 * The core orchestrator logic.
 */

app.post("/api/incident/old", async (req, res) => {
  const { lat, lng, severity, patient_count } = req.body;
  if (!lat || !lng || !patient_count) {
    return res
      .status(400)
      .json({ error: "Missing lat, lng, or patient_count" });
  }

  const incidentLocation = [lng, lat];
  console.log(
    `[Incident] New incident at ${incidentLocation}, ${patient_count} patients.`
  );

  try {
    // --- 1. Create the Incident ---
    const incident = await Incident.create({
      location: { coordinates: incidentLocation },
      severity,
      patient_count,
    });

    // --- 2. Find Resources ---

    // Find nearest N ambulances (e.g., limit to 10)
    const availableAmbulances = await Ambulance.find({
      status: "available",
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: incidentLocation },
          $maxDistance: 20000, // 20km radius
        },
      },
    }).limit(10); // Find up to 10 ambulances

    // Find all hospitals with required capabilities (e.g., 'trauma' for high severity)
    const requiredCapability = severity === "high" ? "trauma" : "general";
    const candidateHospitals = await Hospital.find({
      capabilities: { $in: [requiredCapability, "general"] }, // Must have capability
    });

    if (availableAmbulances.length === 0) {
      return res
        .status(404)
        .json({ message: "No available ambulances found.", incident });
    }
    if (candidateHospitals.length === 0) {
      return res
        .status(404)
        .json({ message: "No candidate hospitals found.", incident });
    }

    // --- 3. Run Greedy Assignment ---
    // We need to assign `patient_count` patients. For this demo,
    // we assume 1 patient per ambulance. We'll assign `N` ambulances,
    // where N = min(patient_count, availableAmbulances.length)

    const numToAssign = Math.min(patient_count, availableAmbulances.length);
    const assignments = [];

    // Keep a *temporary* copy of hospital capacity to avoid DB-hammering
    // This is the hacky part that Redis would solve.
    const tempHospitalCapacity = {};
    candidateHospitals.forEach((h) => {
      tempHospitalCapacity[h._id] = {
        free_er: h.free_er_beds,
      };
    });

    for (let i = 0; i < numToAssign; i++) {
      const ambulance = availableAmbulances[i];

      // Calculate ETA from this ambulance to ALL candidate hospitals
      const hospitalETAs = candidateHospitals.map((hospital) => ({
        hospital,
        eta: getMockETA(
          ambulance.location.coordinates,
          hospital.location.coordinates
        ),
        currentLoad: tempHospitalCapacity[hospital._id].free_er,
      }));

      // Sort by best choice:
      // 1. Must have free ER beds (load > 0)
      // 2. Lowest ETA
      // 3. (Balancing) If ETAs are equal, pick hospital with *more* free beds
      hospitalETAs.sort((a, b) => {
        if (a.currentLoad > 0 && b.currentLoad <= 0) return -1; // a is better
        if (b.currentLoad > 0 && a.currentLoad <= 0) return 1; // b is better

        // If both have capacity or both are full
        if (a.eta !== b.eta) {
          return a.eta - b.eta; // Sort by lowest ETA
        }

        // If ETA is same, balance load by picking one with more capacity
        return b.currentLoad - a.currentLoad;
      });

      // Select the best hospital
      const bestChoice = hospitalETAs[0];

      if (!bestChoice || bestChoice.currentLoad <= 0) {
        // All hospitals are full! For now, we just log and stop.
        console.log(`[Assignment] No capacity found for patient ${i + 1}.`);
        continue; // Skip this assignment
      }

      // --- 4. Create the Assignment ---
      const assignedHospital = bestChoice.hospital;

      const assignment = await Assignment.create({
        incident: incident._id,
        ambulance: ambulance._id,
        hospital: assignedHospital._id,
        eta_minutes: bestChoice.eta,
      });

      // --- 5. Update State (This is the critical part) ---

      // Mark ambulance as assigned
      // We do this non-blocking (fire and forget) for speed
      Ambulance.updateOne(
        { _id: ambulance._id },
        { $set: { status: "assigned" } }
      ).exec();

      // Decrement hospital capacity *in our temporary object*
      tempHospitalCapacity[assignedHospital._id].free_er -= 1;

      // And update the DB (This is the "slow" part)
      // We use $inc for an atomic decrement
      Hospital.updateOne(
        { _id: assignedHospital._id },
        { $inc: { free_er_beds: -1 } }
      ).exec();

      assignments.push(assignment);

      console.log(
        `[Assignment] Ambulance ${ambulance.vehicle_id} -> Hospital ${assignedHospital.name}`
      );
    }

    // --- 6. Notify Frontend ---
    const populatedAssignments = await Assignment.find({
      _id: { $in: assignments.map((a) => a._id) },
    }).populate("ambulance hospital incident");

    io.emit("new_assignments", populatedAssignments);
    io.emit("hospital_update", await Hospital.find()); // Send full hospital update

    res.status(201).json({
      message: `Assigned ${assignments.length} ambulances.`,
      assignments: populatedAssignments,
      incident,
    });
  } catch (error) {
    console.error("[API] Error in /api/incident:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/incident/old1", async (req, res) => {
  const { lat, lng, severity, patient_count } = req.body;
  if (!lat || !lng || !patient_count) {
    return res
      .status(400)
      .json({ error: "Missing lat, lng, or patient_count" });
  }
  const incidentLocation = [lng, lat];

  // create incident first (outside transaction fine)
  const incident = await Incident.create({
    location: { type: "Point", coordinates: incidentLocation },
    severity,
    patient_count,
  });

  try {
    // fetch available ambulances & candidate hospitals
    const availableAmbulances = await Ambulance.find({
      status: "available",
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: incidentLocation },
          $maxDistance: 20000,
        },
      },
    }).limit(10);

    const requiredCapability = severity === "high" ? "trauma" : "general";
    const candidateHospitals = await Hospital.find({
      capabilities: { $in: [requiredCapability, "general"] },
    });

    if (availableAmbulances.length === 0) {
      return res
        .status(404)
        .json({ message: "No available ambulances found.", incident });
    }
    if (candidateHospitals.length === 0) {
      return res
        .status(404)
        .json({ message: "No candidate hospitals found.", incident });
    }

    // helper: compute ETA function (replace with real routing call)
    const computeETA = (fromCoords, toCoords) =>
      getMockETA(fromCoords, toCoords);

    const numToAssign = Math.min(patient_count, availableAmbulances.length);
    const assignments = [];

    // Start a mongoose session for transaction
    const session = await mongoose.startSession();
    for (let i = 0; i < numToAssign; i++) {
      const ambulance = availableAmbulances[i];

      // compute ETAs to hospitals and sort as you did (prefer hospitals with beds and low ETA)
      const hospitalETAs = candidateHospitals
        .map((h) => ({
          hospital: h,
          eta: computeETA(
            ambulance.location.coordinates,
            h.location.coordinates
          ),
          free_er: h.free_er_beds,
        }))
        .sort((a, b) => {
          // prefer hospital with free beds
          if (a.free_er > 0 !== b.free_er > 0) {
            return b.free_er > 0 ? 1 : -1;
          }
          if (a.eta !== b.eta) return a.eta - b.eta;
          return b.free_er - a.free_er;
        });

      // Try to reserve the best hospital atomically (no other process can take that bed)
      let reservedHospital = null;
      await session.withTransaction(async () => {
        for (const he of hospitalETAs) {
          // atomic decrement if free_er_beds > 0
          const updatedHospital = await Hospital.findOneAndUpdate(
            { _id: he.hospital._id, free_er_beds: { $gt: 0 } },
            { $inc: { free_er_beds: -1 } },
            { new: true, session }
          );

          if (!updatedHospital) {
            // this hospital had no beds by the time we tried; try next
            continue;
          }

          // now reserve the ambulance atomically (only if still available)
          const reservedAmbulance = await Ambulance.findOneAndUpdate(
            { _id: ambulance._id, status: "available" },
            { $set: { status: "assigned" } },
            { new: true, session }
          );

          if (!reservedAmbulance) {
            // could not reserve ambulance (someone else took it) -> rollback hospital decrement by re-incrementing
            // we can throw to abort transaction, which will rollback the hospital decrement
            throw new Error(
              "Ambulance reservation failed; aborting transaction"
            );
          }

          // create assignment inside transaction so it's consistent
          const assignment = await Assignment.create(
            [
              {
                incident: incident._id,
                ambulance: reservedAmbulance._id,
                hospital: updatedHospital._id,
                eta_minutes: he.eta,
              },
            ],
            { session }
          );

          // success - set reservedHospital so outer code can push
          reservedHospital = {
            hospital: updatedHospital,
            ambulance: reservedAmbulance,
            assignment: assignment[0],
          };
          break;
        } // end for hospitalETAs
        // If no hospital reserved, the transaction will just commit no changes (or we can throw to abort explicitly)
      }); // end withTransaction

      if (reservedHospital) {
        assignments.push(reservedHospital.assignment);
        console.log(
          `[Assignment] Ambulance ${reservedHospital.ambulance.vehicle_id} -> Hospital ${reservedHospital.hospital.name}`
        );
      } else {
        console.log(`[Assignment] No capacity found for patient ${i + 1}.`);
        // continue to try next ambulance (or break depending on policy)
      }
    } // end for ambulances

    session.endSession();

    // populate and notify
    const populatedAssignments = await Assignment.find({
      _id: { $in: assignments.map((a) => a._id) },
    }).populate("ambulance hospital incident");

    io.emit("new_assignments", populatedAssignments);
    io.emit("hospital_update", await Hospital.find());

    return res.status(201).json({
      message: `Assigned ${assignments.length} ambulances.`,
      assignments: populatedAssignments,
      incident,
    });
  } catch (err) {
    console.error("[API] Error in /api/incident:", err);
    return res.status(500).json({ error: err.message });
  }
});

app.post("/api/incident", async (req, res) => {
  const { lat, lng, severity, patient_count } = req.body;
  if (!lat || !lng || !patient_count) {
    return res
      .status(400)
      .json({ error: "Missing lat, lng, or patient_count" });
  }

  const incidentLocation = [lng, lat];

  const incident = await Incident.create({
    location: { type: "Point", coordinates: incidentLocation },
    severity,
    patient_count,
  });

  try {
    const availableAmbulances = await Ambulance.find({
      status: "available",
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: incidentLocation },
          $maxDistance: 20000,
        },
      },
    }).limit(10);

    if (availableAmbulances.length === 0) {
      return res
        .status(404)
        .json({ message: "No available ambulances found.", incident });
    }

    const requiredCapability = severity === "high" ? "trauma" : "general";

    const candidateHospitals = await Hospital.find({
      capabilities: { $in: [requiredCapability, "general"] },
    });

    if (candidateHospitals.length === 0) {
      return res
        .status(404)
        .json({ message: "No candidate hospitals found.", incident });
    }

    // Helper: transient-detection
    function isTransientTransactionError(err) {
      const labels = err && err.errorLabels;
      if (
        labels &&
        (labels.includes("TransientTransactionError") ||
          labels.includes("UnknownTransactionCommitResult"))
      ) {
        return true;
      }
      const msg = err && err.message;
      return /WriteConflict|TransientTransactionError|UnknownTransactionCommitResult/i.test(
        msg
      );
    }

    const assignments = [];
    const numToAssign = Math.min(patient_count, availableAmbulances.length);

    const computeETA = (fromCoords, toCoords) =>
      getMockETA(fromCoords, toCoords);

    // assign ambulances one-by-one (you could parallelize but ensure distinct ambulances)
    for (let i = 0; i < numToAssign; i++) {
      const ambulance = availableAmbulances[i];
      let finalAssignment = null;

      const maxTxnRetries = 5;
      let attempt = 0;

      // Retry the entire transaction on transient errors (write conflicts)
      while (attempt < maxTxnRetries && !finalAssignment) {
        attempt++;
        const session = await mongoose.startSession();
        try {
          await session.withTransaction(
            async () => {
              // 1. Re-check ambulance is still available (snapshot read inside txn)
              const freshAmb = await Ambulance.findOne({
                _id: ambulance._id,
                status: "available",
              }).session(session);

              if (!freshAmb) {
                // Another process took this ambulance — exit this txn so caller will retry/skip
                throw new Error("Ambulance already taken");
              }

              // 2. Re-fetch candidate hospitals inside txn
              const hospitals = await Hospital.find({
                _id: { $in: candidateHospitals.map((h) => h._id) },
              }).session(session);

              // 3. Compute ETAs and prefer hospitals with free beds first.
              const hospitalETAs = hospitals
                .map((h) => ({
                  hospital: h,
                  eta: computeTotalETA(
                    freshAmb.location.coordinates,
                    incidentLocation,
                    h.location.coordinates
                  ),
                  free_er: h.free_er_beds || 0,
                }))
                .sort((a, b) => {
                  // prefer hospitals that HAVE free beds (higher priority)
                  const aHas = a.free_er > 0 ? 1 : 0;
                  const bHas = b.free_er > 0 ? 1 : 0;
                  if (aHas !== bHas) return bHas - aHas;
                  if (a.eta !== b.eta) return a.eta - b.eta;
                  return b.free_er - a.free_er;
                });

              // 4. Try to atomically decrement free_er_beds for top candidate hospitals
              let reservedHospital = null;
              for (const he of hospitalETAs) {
                // Atomic check-and-decrement on hospital doc inside txn
                const updatedHospital = await Hospital.findOneAndUpdate(
                  { _id: he.hospital._id, free_er_beds: { $gt: 0 } },
                  { $inc: { free_er_beds: -1 } },
                  { new: true, session }
                );

                if (!updatedHospital) continue;
                reservedHospital = updatedHospital;
                break;
              }

              if (!reservedHospital) {
                throw new Error("No hospital capacity");
              }

              // 5. Atomically lock the ambulance (double-check and set status)
              const reservedAmbulance = await Ambulance.findOneAndUpdate(
                { _id: freshAmb._id, status: "available" },
                { $set: { status: "assigned" } },
                { new: true, session }
              );

              if (!reservedAmbulance) {
                // Another process beat us to locking the ambulance — cause retry/abort
                throw new Error("Ambulance locked by another process");
              }

              // 6. Create assignment record inside txn
              const created = await Assignment.create(
                [
                  {
                    incident: incident._id,
                    ambulance: reservedAmbulance._id,
                    hospital: reservedHospital._id,
                    eta_minutes: computeTotalETA(
                      reservedAmbulance.location.coordinates,
                      incidentLocation,
                      reservedHospital.location.coordinates
                    ),
                  },
                ],
                { session }
              );

              // assignment created successfully
              finalAssignment = created[0];
            },
            {
              // optional txn options:
              readConcern: { level: "snapshot" },
              writeConcern: { w: "majority" },
            }
          );
          // if withTransaction callback completed without throwing, finalAssignment should be set
        } catch (err) {
          console.log(
            `[Attempt ${attempt}/${maxTxnRetries}] assignment failed for ambulance ${ambulance._id}:`,
            err.message
          );

          // If transient, wait a bit and retry whole txn
          if (isTransientTransactionError(err) && attempt < maxTxnRetries) {
            const backoffMs = Math.min(100 * Math.pow(2, attempt - 1), 2000);
            await new Promise((r) => setTimeout(r, backoffMs));
            // continue to next attempt
          } else {
            // permanent failure — stop retrying
            break;
          }
        } finally {
          session.endSession();
        }
      } // end retry loop

      if (finalAssignment) {
        assignments.push(finalAssignment);
      } else {
        console.log(
          `Could not assign ambulance ${ambulance._id} after retries.`
        );
      }
    } // end ambulance loop

    // populate and emit AFTER all transactional changes are committed
    const populatedAssignments = await Assignment.find({
      _id: { $in: assignments.map((a) => a._id) },
    }).populate("ambulance hospital incident");

    io.emit("new_assignments", populatedAssignments);
    io.emit("hospital_update", await Hospital.find());

    return res.status(201).json({
      message: `Assigned ${assignments.length} ambulances.`,
      assignments: populatedAssignments,
      incident,
    });
  } catch (err) {
    console.error("[API] Error in /api/incident:", err);
    return res.status(500).json({ error: err.message });
  }
});

// ===========================================
// --- 4. Start Server ---
// ===========================================
async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("[MongoDB] Connected successfully.");

    server.listen(PORT, () => {
      console.log(
        `[Server] MCAO Backend listening on http://localhost:${PORT}`
      );
    });

    // --- Mock Hospital Heartbeat (Simulates capacity changes) ---
    // This is optional, but makes the demo "live"
    setInterval(async () => {
      // Find a random hospital and "free up" one bed
      const oneHospital = await Hospital.findOne();
      if (oneHospital) {
        const newFreeBeds = Math.min(
          oneHospital.total_er_beds,
          oneHospital.free_er_beds + 1
        );
        await Hospital.updateOne(
          { _id: oneHospital._id },
          { $set: { free_er_beds: newFreeBeds } }
        );

        // Notify all clients of the change
        const updatedHospitals = await Hospital.find();
        io.emit("hospital_update", updatedHospitals);
        // console.log(`[Heartbeat] Updated ${oneHospital.name}`);
      }
    }, 15000); // Every 15 seconds
  } catch (error) {
    console.error("[Startup Error] Failed to connect to database:", error);
    process.exit(1);
  }
}

// --- Run the server ---
startServer();
