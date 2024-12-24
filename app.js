import express from "express";
import morgan from "morgan";
import cors from "cors"; // Ajoutez cette ligne
import uniteRouter from "./routes/uniteRoutes.js";
import dotenv from "dotenv";
import ticketMaintenanceRoutes from "./routes/ticketMaintenanceRoutes.js";
import fournitureRoutes from "./routes/ticketFournitureRoutes.js";
import userRoutes from "./routes/userRoute.js";
import ticketVehiculeRoutes from "./routes/ticketVehicule.js";
import actifRoutes from "./routes/actifRoute.js";
import connectionHistoryRoutes from "./routes/connectionHistoryRoutes.js";
dotenv.config();

const app = express();

// Utilisation de CORS pour autoriser les requêtes cross-origin
app.use(
  cors({
    origin: [
      "http://localhost:8080",
      "https://scxassetmanagement.netlify.app", // Votre application déployée
    ],
  })
);

// 1) MIDDLEWARE
app.use(morgan("dev"));
app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(`Heure de la requête : ${req.requestTime}`);
  next();
});

// 2) ROUTES
app.use("/api/actifs", actifRoutes);

app.use("/api/v1/unite", uniteRouter);
app.use("/api/ticketvehicules", ticketVehiculeRoutes);

app.use("/api/v1/ticketMaintenance", ticketMaintenanceRoutes);
app.use("/api/v1/fournitureRoutes", fournitureRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/connection-history", connectionHistoryRoutes);

export default app;
