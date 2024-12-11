import Actif from "../models/actifModel.js"; // Importer le modèle Actif

/**
 * Crée un nouvel actif avec ses régions, catégories et équipements
 * @param {Object} req - La requête Express
 * @param {Object} res - La réponse Express
 */
export const createActif = async (req, res) => {
  try {
    const { name, region, categories } = req.body;

    // Crée un nouvel actif avec les données envoyées dans la requête
    const newActif = new Actif({
      name,
      region,
      categories,
    });

    // Sauvegarde l'actif dans la base de données
    const savedActif = await newActif.save();
    res.status(201).json(savedActif); // Retourne l'actif créé
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de la création de l'actif",
      details: error.message,
    });
  }
};

/**
 * Récupère tous les actifs
 * @param {Object} req - La requête Express
 * @param {Object} res - La réponse Express
 */
export const getAllActifs = async (req, res) => {
  try {
    // Récupère tous les actifs de la base de données
    const { user } = req.params;

    const actifs = await Actif.find();
    res.status(200).json(actifs); // Retourne la liste des actifs
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de la récupération des actifs",
      details: error.message,
    });
  }
};

/**
 * Récupère un actif par son ID
 * @param {Object} req - La requête Express
 * @param {Object} res - La réponse Express
 */
export const getActifById = async (req, res) => {
  try {
    const { id } = req.params;

    // Récupère l'actif correspondant à l'ID
    const actif = await Actif.findById(id);

    if (!actif) {
      return res.status(404).json({ error: "Actif non trouvé" });
    }

    res.status(200).json(actif); // Retourne l'actif trouvé
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de la récupération de l'actif",
      details: error.message,
    });
  }
};

/**
 * Met à jour un actif existant
 * @param {Object} req - La requête Express
 * @param {Object} res - La réponse Express
 */
export const updateActif = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Met à jour l'actif avec les nouvelles données
    const updatedActif = await Actif.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedActif) {
      return res.status(404).json({ error: "Actif non trouvé" });
    }

    res.status(200).json(updatedActif); // Retourne l'actif mis à jour
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de la mise à jour de l'actif",
      details: error.message,
    });
  }
};

/**
 * Supprime un actif par son ID
 * @param {Object} req - La requête Express
 * @param {Object} res - La réponse Express
 */
export const deleteActif = async (req, res) => {
  try {
    const { id } = req.params;

    // Supprime l'actif de la base de données
    const deletedActif = await Actif.findByIdAndDelete(id);

    if (!deletedActif) {
      return res.status(404).json({ error: "Actif non trouvé" });
    }

    res.status(200).json({ message: "Actif supprimé avec succès" });
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de la suppression de l'actif",
      details: error.message,
    });
  }
};

/**
 * Ajoute une catégorie à un actif
 * @param {Object} req - La requête Express
 * @param {Object} res - La réponse Express
 */
export const addCategoryToActif = async (req, res) => {
  try {
    const { id } = req.params; // ID de l'actif
    const { category } = req.body; // Données de la nouvelle catégorie

    // Ajoute la catégorie dans l'actif
    const updatedActif = await Actif.findByIdAndUpdate(
      id,
      { $push: { categories: category } },
      { new: true }
    );

    if (!updatedActif) {
      return res.status(404).json({ error: "Actif non trouvé" });
    }

    res.status(200).json(updatedActif); // Retourne l'actif mis à jour
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de l'ajout de la catégorie",
      details: error.message,
    });
  }
};

/**
 * Ajoute un équipement à une catégorie spécifique
 * @param {Object} req - La requête Express
 * @param {Object} res - La réponse Express
 */
export const addEquipmentToCategory = async (req, res) => {
  try {
    const { actifId, categoryId } = req.params; // ID de l'actif et de la catégorie
    const { equipment } = req.body; // Données du nouvel équipement

    // Met à jour la catégorie avec un nouvel équipement
    const updatedActif = await Actif.findOneAndUpdate(
      { _id: actifId, "categories._id": categoryId },
      { $push: { "categories.$.equipments": equipment } },
      { new: true }
    );

    if (!updatedActif) {
      return res.status(404).json({ error: "Actif ou catégorie non trouvé" });
    }

    res.status(200).json(updatedActif); // Retourne l'actif mis à jour
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de l'ajout de l'équipement",
      details: error.message,
    });
  }
};

/**
 * Met à jour un équipement par son ID dans une catégorie spécifique
 * @param {Object} req - La requête Express
 * @param {Object} res - La réponse Express
 */
export const updateEquipmentById = async (req, res) => {
  try {
    const { actifId, categoryId, equipmentId } = req.params;
    const { isFunctionel, name, description } = req.body;

    // Recherche de l'actif
    const actif = await Actif.findById(actifId);
    if (!actif) return res.status(404).json({ message: "Actif non trouvé" });

    // Recherche de la catégorie
    const category = actif.categories.id(categoryId);
    if (!category)
      return res.status(404).json({ message: "Catégorie non trouvée" });

    // Recherche de l'équipement
    const equipment = category.equipments.id(equipmentId);
    if (!equipment)
      return res.status(404).json({ message: "Équipement non trouvé" });

    // Mise à jour des champs
    if (isFunctionel !== undefined) equipment.isFunctionel = isFunctionel;
    if (name) equipment.name = name;
    if (description) equipment.description = description;

    // Sauvegarde
    await actif.save();

    res
      .status(200)
      .json({ message: "Équipement mis à jour avec succès", equipment });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
