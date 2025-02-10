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
import getTicketsWithSubTickets from "./routes/subTicketsRoute.js";
import ummcPerformanceRoute from "./routes/ummcperformanceRoute.js";
import MergedData from "./routes/mergedDataRoute.js";
import actifInventaire from "./routes/actifInventaireRoute.js";
import absenceRoutes from "./routes/congéRoute.js";
import reclamationRoute from "./routes/reclamationRoute.js";
import TestSpeedNetworkRoute from "./routes/testSpeedNetworkRoute.js";
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
app.use("/api/v1", getTicketsWithSubTickets);
app.use("/api/v1/ummcperformance", ummcPerformanceRoute);
app.use("/api/v1", MergedData);
app.use("/api/v1/inventaire", actifInventaire);
app.use("/api/v1/absences", absenceRoutes);
app.use("/api/v1/reclamation", reclamationRoute);
app.use("/api/v1/testSpeedNetwork", TestSpeedNetworkRoute);

export default app;
