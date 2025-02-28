import Pathologie from "../models/patholigiesModel.js";

// Obtenir toutes les pathologies
export const getAllPathologies = async (req, res) => {
  try {
    const { region, province, unite } = req.query;

    // Construire un objet de filtre basé sur les paramètres reçus
    let filter = {};
    if (region) filter.region = region;
    if (province) filter.province = province;
    if (unite) filter.unite = unite;

    const pathologies = await Pathologie.find(filter);

    // Vérifier s'il y a des résultats
    if (pathologies.length === 0) {
      return res
        .status(200)
        .json({ message: "Aucune donnée trouvée", percentages: {} });
    }

    // Initialiser un objet pour stocker la somme des valeurs
    let totalCasesByPathology = {};
    let totalCases = 0;

    pathologies.forEach((entry) => {
      Object.entries(entry.toObject()).forEach(([key, value]) => {
        if (typeof value === "number") {
          totalCasesByPathology[key] =
            (totalCasesByPathology[key] || 0) + value;
          totalCases += value;
        }
      });
    });

    // Calculer les pourcentages globaux
    let totalPercentages = {};
    if (totalCases > 0) {
      totalPercentages = Object.fromEntries(
        Object.entries(totalCasesByPathology).map(([key, value]) => [
          key,
          ((value / totalCases) * 100).toFixed(2),
        ])
      );
    }

    res.status(200).json({
      totalCasesByPathology,
      totalCases,
      percentages: totalPercentages,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des pathologies",
      error,
    });
  }
};

// Créer une ou plusieurs pathologies
export const createPathologie = async (req, res) => {
  try {
    const data = req.body;

    // Vérifier si on reçoit un tableau ou un seul objet
    if (Array.isArray(data)) {
      const newPathologies = await Pathologie.insertMany(data);
      res.status(201).json(newPathologies);
    } else {
      const newPathologie = new Pathologie(data);
      await newPathologie.save();
      res.status(201).json(newPathologie);
    }
  } catch (error) {
    res
      .status(400)
      .json({ message: "Erreur lors de la création de la pathologie", error });
  }
};
