import express from "express";

import {
  getAllInactiveUmmc,
  createInactiveUmmc,
} from "../controllers/ummcInactiveController.js";

const router = express.Router();

router.get("/", getAllInactiveUmmc);
router.post("/", createInactiveUmmc);

export default router;
