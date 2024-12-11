// routes/uniteRoutes.js
import express from "express";
import {
  getAllUnite,
  createUnite,
  getUnite,
  updateUnite,
  deleteUnite,
} from "../controllers/uniteController.js";

const router = express.Router();

router.route("/").get(getAllUnite).post(createUnite);
router.route("/:id").get(getUnite).patch(updateUnite).delete(deleteUnite);

export default router;
