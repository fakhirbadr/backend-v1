import ummcperformance from "../models/ummcperformanceModel.js";

// Fonction pour récupérer toutes les données (GET)
export const getAllUmmcPerformance = async (req, res) => {
  try {
    const { region, province, unite } = req.query; // Extraire les paramètres de requête

    // Construire un filtre dynamique
    const filter = {};
    if (region) filter.region = region;
    if (province) filter.province = province;
    if (unite) filter.unite = unite;

    // Trouver toutes les entrées correspondant au filtre
    const data = await ummcperformance.find(filter);

    let totalPriseEnCharge = 0;
    const ageRanges = { "0-6": 0, "7-14": 0, "15-24": 0, "25-64": 0 };

    data.forEach((entry) => {
      totalPriseEnCharge += entry.totalPriseEnCharge || 0;

      ageRanges["0-6"] += entry.ageGroup0to6 || 0;
      ageRanges["7-14"] += entry.ageGroup7to14 || 0;
      ageRanges["15-24"] += entry.ageGroup15to24 || 0;
      ageRanges["25-64"] += entry.ageGroup25to64 || 0;
    });

    const ageRates = totalPriseEnCharge
      ? {
          "0-6": ((ageRanges["0-6"] / totalPriseEnCharge) * 100).toFixed(2),
          "7-14": ((ageRanges["7-14"] / totalPriseEnCharge) * 100).toFixed(2),
          "15-24": ((ageRanges["15-24"] / totalPriseEnCharge) * 100).toFixed(2),
          "25-64": ((ageRanges["25-64"] / totalPriseEnCharge) * 100).toFixed(2),
        }
      : { "0-6": "0.00", "7-14": "0.00", "15-24": "0.00", "25-64": "0.00" };

    res.status(200).json({ totalPriseEnCharge, data, ageRates });
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
