import express from "express";

import {
  getAllReclamations,
  getReclamationById,
  createReclamation,
} from "../controllers/reclamationController.js";

const router = express.Router();

router.get("/", getAllReclamations);

router.get("/:id", getReclamationById);

router.post("/", createReclamation);

export default router;
