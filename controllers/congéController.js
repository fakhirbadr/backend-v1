import Absence from "../models/congéModel.js";

// Obtenir toutes les absences
export const getAllAbsences = async (req, res) => {
  try {
    const { nomComplet } = req.query; // Récupération du paramètre `nomComplet` depuis la requête
    const filter = nomComplet
      ? { nomComplet: { $regex: nomComplet, $options: "i" } }
      : {}; // Filtre avec insensibilité à la casse

    const absences = await Absence.find(filter); // Récupère les données filtrées ou toutes si aucun filtre
    res.status(200).json(absences);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des absences", error });
  }
};

// Obtenir une absence par ID
export const getAbsenceById = async (req, res) => {
  const { id } = req.params;

  try {
    const absence = await Absence.findById(id); // Récupère l'absence par son ID
    if (!absence) {
      return res.status(404).json({ message: "Absence non trouvée" });
    }
    res.status(200).json(absence);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération de l'absence", error });
  }
};

// Ajouter une nouvelle absence
export const createAbsence = async (req, res) => {
  const { nomComplet, historique, role, province, cle } = req.body;

  try {
    const nouvelleAbsence = new Absence({
      nomComplet,
      role,
      historique,
      province,
      cle,
    });

    const absenceSauvegardée = await nouvelleAbsence.save(); // Sauvegarde dans la base de données
    res.status(201).json(absenceSauvegardée);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la création de l'absence", error });
  }
};
// Mettre à jour une absence par ID (PATCH)
export const updateAbsence = async (req, res) => {
  const { id } = req.params;
  const { isValidated, historiqueIndex } = req.body;

  try {
    // Recherche de l'absence par son ID
    const absence = await Absence.findById(id);
    if (!absence) {
      return res.status(404).json({ message: "Absence non trouvée" });
    }

    // Vérifie si l'index est valide
    if (historiqueIndex < 0 || historiqueIndex >= absence.historique.length) {
      return res.status(400).json({ message: "Index d'historique invalide" });
    }

    // Mise à jour du champ `isValidated` dans l'élément `historique`
    absence.historique[historiqueIndex].isValidated = isValidated;

    // Sauvegarde les modifications dans la base de données
    const absenceMiseAJour = await absence.save();

    res.status(200).json(absenceMiseAJour);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour de l'absence", error });
  }
};
