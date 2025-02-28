import express from "express";

import {
  getAllUmmcPerformance,
  getTeleexpertise,
  createUmmcPerformance,
  getPathologyPercentages,
  getAllConsultation,
  getAllTeleexpertises,
} from "../controllers/ummcPerformanceController.js";
const router = express.Router();

router.get("/", getAllUmmcPerformance);
router.get("/tele", getTeleexpertise);
router.get("/path", getPathologyPercentages);
router.post("/", createUmmcPerformance);
router.get("/consultations", getAllConsultation);
router.get("/teleexpertises", getAllTeleexpertises);

export default router;
