import express from "express";
import {
  getAllPathologies,
  createPathologie,
} from "../controllers/pathologieController.js";

const router = express.Router();

// Route pour récupérer toutes les pathologies
router.get("/", getAllPathologies);

// Route pour créer une nouvelle pathologie
router.post("/", createPathologie);



export default router;
