import express from "express";
import { getDoctorsByHospital } from "../controllers/doctor.js";

const doctorRouter = express.Router();

doctorRouter.get("/:hospitalId", getDoctorsByHospital);

export default doctorRouter;
