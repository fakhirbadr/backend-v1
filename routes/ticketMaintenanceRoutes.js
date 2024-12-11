import express from "express";
import {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
} from "../controllers/ticketMaintenanceController.js";

const router = express.Router();

// Define the routes
router.get("/", getAllTickets); // Get all tickets
router.get("/:id", getTicketById); // Get ticket by ID
router.post("/", createTicket); // Create a new ticket
router.patch("/:id", updateTicket); // Update a ticket by ID
router.delete("/:id", deleteTicket); // Delete a ticket by ID

export default router;
