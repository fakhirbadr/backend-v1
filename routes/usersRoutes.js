import express from "express";
import {
  getallusers,
  createUsers,
  getUser,
  updateUser,
  deleteUser,
} from "./../controllers/userController.js"; // Assurez-vous que l'extension .js est présente

const router = express.Router();

router.route("/").get(getallusers).post(createUsers);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default router;
