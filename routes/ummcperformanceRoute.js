import express from "express";

import {
  getAllUmmcPerformance,
  createUmmcPerformance,
} from "../controllers/ummcPerformanceController.js";
const router = express.Router();

router.get("/", getAllUmmcPerformance);
router.post("/", createUmmcPerformance);
export default router;
