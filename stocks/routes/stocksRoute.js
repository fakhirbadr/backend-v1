import expess from "express";
import {
  getAllStocks,
  createStocks,
  updateStock,
} from "../controllers/stocksControlle.js";

const router = expess.Router();

router.route("/").get(getAllStocks).post(createStocks);
router.route("/:id").patch(updateStock);

export default router;
