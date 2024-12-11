import express from "express";
import {
  createActif,
  getAllActifs,
  getActifById,
  updateActif,
  deleteActif,
  addCategoryToActif,
  addEquipmentToCategory,
  updateEquipmentById,
} from "../controllers/actifController.js";

const router = express.Router();

// Récupérer tous les actifs
router.get("/", getAllActifs);

// Récupérer un actif par son ID
router.get("/:id", getActifById);

// Créer un nouvel actif
router.post("/", createActif);

// Mettre à jour un actif existant
router.put("/:id", updateActif);

// Supprimer un actif
router.delete("/:id", deleteActif);

// Ajouter une catégorie à un actif spécifique
router.post("/:id/categories", addCategoryToActif);

// Ajouter un équipement à une catégorie spécifique dans un actif
router.post("/:id/categories/:categoryId/equipments", addEquipmentToCategory);

router.put(
  "/:actifId/categories/:categoryId/equipments/:equipmentId",
  updateEquipmentById
);

export default router;
