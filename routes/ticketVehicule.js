import express from "express";
import {
  getAllTicketVehicules,
  getTicketVehiculeById,
  createTicketVehicule,
  updateTicketVehicule,
  deleteTicketVehicule,
} from "../controllers/ticketVehiculeController.js";

const router = express.Router();

// Route to get all ticketvehicules
router.get("/", getAllTicketVehicules);

// Route to get a single ticketvehicule by ID
router.get("/:id", getTicketVehiculeById);

// Route to create a new ticketvehicule
router.post("/", createTicketVehicule);

// Route to update a ticketvehicule by ID
router.put("/:id", updateTicketVehicule);

// Route to delete a ticketvehicule by ID
router.delete("/:id", deleteTicketVehicule);

export default router;
