import tauxSpecialite from "../models/specialiteModel.js";

export const createTauxSpecialite = async (req, res) => {
  try {
    let savedSpecialite;

    // Vérifier si req.body est un tableau
    if (Array.isArray(req.body)) {
      // Si c'est un tableau, utiliser insertMany pour insérer plusieurs documents
      savedSpecialite = await tauxSpecialite.insertMany(req.body);
    } else {
      // Si c'est un objet, utiliser save pour insérer un seul document
      const newSpecialite = new tauxSpecialite(req.body);
      savedSpecialite = await newSpecialite.save();
    }

    // Répondre avec les données sauvegardées
    res.status(201).json(savedSpecialite);
  } catch (error) {
    // Gérer les erreurs
    res.status(400).json({ message: error.message });
  }
};

export const getAllTauxSpecialite = async (req, res) => {
  try {
    // Récupérer toutes les spécialités
    const specialites = await tauxSpecialite.find();

    // Calculer le taux par nom de médecin
    const tauxParMedecin = await tauxSpecialite.aggregate([
      {
        $group: {
          _id: "$NomdDuMedecinSpecialiste", // Grouper par nom de médecin
          count: { $sum: 1 }, // Compter le nombre d'entrées pour chaque médecin
        },
      },
      {
        $project: {
          _id: 1, // Inclure le nom du médecin
          taux: {
            $multiply: [{ $divide: ["$count", specialites.length] }, 100],
          }, // Calculer le pourcentage
        },
      },
    ]);

    // Calculer le taux par plateau
    const tauxParPlateau = await tauxSpecialite.aggregate([
      {
        $group: {
          _id: "$plateau", // Grouper par plateau
          count: { $sum: 1 }, // Compter le nombre d'entrées pour chaque plateau
        },
      },
      {
        $project: {
          _id: 1, // Inclure le nom du plateau
          taux: {
            $multiply: [{ $divide: ["$count", specialites.length] }, 100],
          }, // Calculer le pourcentage
        },
      },
    ]);

    // Calculer le taux par spécialité
    const tauxParSpecialite = await tauxSpecialite.aggregate([
      {
        $group: {
          _id: "$specialite", // Grouper par spécialité
          count: { $sum: 1 }, // Compter le nombre d'entrées pour chaque spécialité
        },
      },
      {
        $project: {
          _id: 1, // Inclure le nom de la spécialité
          taux: {
            $multiply: [{ $divide: ["$count", specialites.length] }, 100],
          }, // Calculer le pourcentage
        },
      },
    ]);

    // Répondre avec les données
    res.status(200).json({
      specialites, // Toutes les spécialités
      tauxParMedecin, // Taux par médecin
      tauxParPlateau, // Taux par plateau
      tauxParSpecialite, // Taux par spécialité
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
