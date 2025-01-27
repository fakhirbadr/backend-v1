import ummcperformance from "../models/ummcperformanceModel.js";

// Fonction pour récupérer toutes les données (GET)
export const getAllUmmcPerformance = async (req, res) => {
  try {
    const { region } = req.query; // Extraire la région depuis les paramètres de requête

    // Construire une condition de filtre si une région est spécifiée
    const filter = region ? { region } : {};

    // Trouver toutes les entrées correspondant au filtre
    const data = await ummcperformance.find(filter);

    // Variables pour calculer les totaux des tranches d'âge
    let totalCount = 0;
    let totalPriseEnCharge = 0;
    const ageRanges = {
      "0-6": 0,
      "7-14": 0,
      "15-24": 0,
      "25-64": 0,
    };

    // Calcul des totaux pour chaque tranche d'âge et total de `totalPriseEnCharge`
    data.forEach((entry) => {
      totalPriseEnCharge += entry.totalPriseEnCharge;
      totalCount++; // Incrémenter le total des entrées traitées

      const { ageGroup0to6, ageGroup7to14, ageGroup15to24, ageGroup25to64 } =
        entry;

      ageRanges["0-6"] += ageGroup0to6 || 0;
      ageRanges["7-14"] += ageGroup7to14 || 0;
      ageRanges["15-24"] += ageGroup15to24 || 0;
      ageRanges["25-64"] += ageGroup25to64 || 0;
    });

    // Calcul des pourcentages
    const ageRates = {
      "0-6": ((ageRanges["0-6"] / totalPriseEnCharge) * 100).toFixed(2),
      "7-14": ((ageRanges["7-14"] / totalPriseEnCharge) * 100).toFixed(2),
      "15-24": ((ageRanges["15-24"] / totalPriseEnCharge) * 100).toFixed(2),
      "25-64": ((ageRanges["25-64"] / totalPriseEnCharge) * 100).toFixed(2),
    };

    // Retourner les données et les taux des tranches d'âge
    res.status(200).json({ data, ageRates });
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Fonction pour ajouter de nouvelles données (POST)
export const createUmmcPerformance = async (req, res) => {
  try {
    const data = req.body;

    // Vérifier si les données reçues sont un tableau
    if (Array.isArray(data)) {
      // Si c'est un tableau, insérer plusieurs entrées
      await ummcperformance.insertMany(data);
      return res
        .status(201)
        .json({ message: "Données multiples ajoutées avec succès" });
    } else {
      // Si ce n'est pas un tableau, insérer une seule entrée
      const {
        date,
        region,
        province,
        unite,
        totalPriseEnCharge,
        effectifTotalOperationnel,
        totalUMMCInstallees,
        ageGroup0to6,
        ageGroup7to14,
        ageGroup15to24,
        ageGroup25to64,
      } = data;

      // Création d'une nouvelle performance avec les tranches d'âge
      const newPerformance = new ummcperformance({
        date,
        region,
        province,
        unite,
        totalPriseEnCharge,
        effectifTotalOperationnel,
        totalUMMCInstallees,
        ageGroup0to6,
        ageGroup7to14,
        ageGroup15to24,
        ageGroup25to64,
      });

      // Sauvegarder la nouvelle entrée dans la base de données
      await newPerformance.save();
      return res.status(201).json({ message: "Données ajoutées avec succès" });
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout des données :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
