import express from "express";
import {
  getAllFournitures,
  getFournitureById,
  createFourniture,
  updateFourniture,
  deleteFourniture,
} from "../controllers/ticketFournitureController.js";

const router = express.Router();

// Route to get all Fournitures
router.get("/", getAllFournitures);

// Route to get a Fourniture by ID
router.get("/:id", getFournitureById);

// Route to create a new Fourniture
router.post("/", createFourniture);

// Route to update an existing Fourniture by ID
router.patch("/:id", updateFourniture);

// Route to delete a Fourniture by ID
router.delete("/:id", deleteFourniture);

export default router;
