import express from "express";

import {
  getAllUmmcPerformance,
  getTeleexpertise,
  createUmmcPerformance,
  getPathologyPercentages,
  getAllConsultation,
  getAllTeleexpertises,
  getAgeRanges,
} from "../controllers/ummcPerformanceController.js";
const router = express.Router();

router.get("/", getAllUmmcPerformance);
router.get("/tele", getTeleexpertise);
router.get("/path", getPathologyPercentages);
router.post("/", createUmmcPerformance);
router.get("/consultations", getAllConsultation);
router.get("/teleexpertises", getAllTeleexpertises);
router.get("/ageRanges", getAgeRanges);

export default router;
