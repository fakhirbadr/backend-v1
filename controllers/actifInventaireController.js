import ActifInventaire from "../models/actifInventaireModel.js";

// Récupérer tous les inventaires d'actifs
export const getAllActifsInventaire = async (req, res) => {
  const { selectedUnite } = req.query; // Récupère le paramètre `selectedUnite` depuis la requête

  try {
    // Crée un filtre conditionnel
    const filter = selectedUnite
      ? { selectedUnite: { $in: selectedUnite.split(",") } }
      : {};

    // Requête MongoDB avec le filtre
    const actifsInventaire = await ActifInventaire.find(filter);

    res.status(200).json(actifsInventaire);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des inventaires d'actifs",
      error,
    });
  }
};

// Créer un nouvel inventaire d'actifs
export const createActifInventaire = async (req, res) => {
  const { technicien, selectedUnite, date, equipment } = req.body;

  if (!technicien || !selectedUnite || !date || !equipment) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }

  try {
    const newActifInventaire = new ActifInventaire({
      technicien,
      selectedUnite,
      date,
      equipment,
    });

    await newActifInventaire.save();
    res.status(201).json({
      message: "Inventaire d'actifs créé avec succès",
      data: newActifInventaire,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la création de l'inventaire d'actifs",
      error,
    });
  }
};

export const updateActifInventaire = async (req, res) => {
  const { id } = req.params; // Assuming the id is passed in the URL
  const { technicien, selectedUnite, date, equipment, validation } = req.body;

  // Ensure at least one field is provided for update
  if (
    !technicien &&
    !selectedUnite &&
    !date &&
    !equipment &&
    validation === undefined
  ) {
    return res.status(400).json({ message: "No fields to update." });
  }

  try {
    const updatedActifInventaire = await ActifInventaire.findByIdAndUpdate(
      id, // Find the document by ID
      {
        technicien,
        selectedUnite,
        date,
        equipment,
        validation, // This will update the 'validation' status
      },
      { new: true } // Return the updated document
    );

    if (!updatedActifInventaire) {
      return res.status(404).json({ message: "ActifInventaire not found." });
    }

    res.status(200).json({
      message: "Inventaire d'actifs mis à jour avec succès",
      data: updatedActifInventaire,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour de l'inventaire d'actifs",
      error,
    });
  }
};
