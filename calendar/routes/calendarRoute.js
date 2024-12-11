import express from "express";
import {
  createCalendar,
  getCalendar,
  updateCalendar,
  deleteCalendar,
} from "../controllers/calendarController.js";

const router = express.Router();

// Récupérer tous les événements (GET) et créer un événement (POST)
router.route("/").get(getCalendar).post(createCalendar);

// Mettre à jour un événement spécifique (PATCH)
router.route("/:id").patch(updateCalendar);

// Supprimer un événement spécifique (DELETE)
router.route("/:id").delete(deleteCalendar);

export default router;
