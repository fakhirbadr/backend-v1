import ConnectionHistory from "../models/connectionHistory.js";

export const recordConnection = async (req, res) => {
  try {
    const { userId, email } = req.body;

    // Récupérer l'adresse IP depuis la requête
    const ipAddress =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    // Créer un enregistrement d'historique
    await ConnectionHistory.create({
      userId,
      email,
      ipAddress,
    });

    // Passer à l'action suivante (utile si combiné avec d'autres middlewares)
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'historique:", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};

export const getConnectionHistory = async (req, res) => {
  try {
    const history = await ConnectionHistory.find();
    console.log("Historique des connexions:", history); // Ajouter un log ici pour vérifier les données récupérées
    res.status(200).json(history);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'historique:", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};
