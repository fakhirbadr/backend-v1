import app from "./app.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Chargement des variables d'environnement depuis config.env
dotenv.config({ path: "./config.env" });

// Remplacement du mot de passe dans l'URL de la base de données
const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

// Connexion à MongoDB avec gestion des erreurs
mongoose
  .connect(DB)
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((err) => console.log("Erreur de connexion :", err));

// Démarrage du serveur
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`L'application fonctionne sur le port ${port}...`);
});
