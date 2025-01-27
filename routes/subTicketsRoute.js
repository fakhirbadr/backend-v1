import express from "express";
import {
  getSubTicketsForMaintenance,
  updateSubTicket,
  getSubTicketById,
} from "../controllers/subTickets.js";

const router = express.Router();

router.get("/subtickets", getSubTicketsForMaintenance);
router.patch("/sub-tickets/:subTicketId", updateSubTicket); // Mettre à jour un sous-ticket
router.get("/subTickets/:subTicketId", getSubTicketById);

// Supprimer un sous-ticket

export default router;
