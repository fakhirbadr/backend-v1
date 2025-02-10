import express from "express";
import {
  getAllTestSpeedNetworks,
  getTestSpeedNetworkById,
  createTestSpeedNetwork,
} from "../controllers/testSpeedNetwork.js";

const router = express.Router();

// Routes
router.get("/", getAllTestSpeedNetworks); // GET all records
router.get("/:id", getTestSpeedNetworkById); // GET record by ID
router.post("/", createTestSpeedNetwork); // POST a new record

export default router;
