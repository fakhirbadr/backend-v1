import express from "express";

import {
  getAllTauxSpecialite,
  createTauxSpecialite,
} from "../controllers/specialiteController.js";
const router = express.Router();

router.get("/", getAllTauxSpecialite);
router.post("/", createTauxSpecialite);

export default router;
