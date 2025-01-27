import express from "express";
import { getMergedData } from "../controllers/mergedDataController.js";

const router = express.Router();

router.get("/merged-data", getMergedData);

export default router;
