import Fourniture from "../models/ticketFournitureModel.js";

// Get all Fournitures
// Get all Fournitures
export const getAllFournitures = async (req, res) => {
  try {
    // Vérifie si le filtre "isClosed" est présent dans la requête
    const { isClosed } = req.query;

    // Crée une condition de filtre si "isClosed" est fourni
    const filter = {};
    if (isClosed !== undefined) {
      // Convertit "true"/"false" en boolean pour la comparaison
      filter.isClosed = isClosed === "true";
    }

    // Récupère les fournitures en fonction du filtre
    const fournitures = await Fourniture.find(filter);

    res.status(200).json(fournitures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Fourniture by ID
export const getFournitureById = async (req, res) => {
  try {
    const fourniture = await Fourniture.findById(req.params.id);
    if (!fourniture) {
      return res.status(404).json({ message: "Fourniture not found" });
    }
    res.status(200).json(fourniture);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new Fourniture
export const createFourniture = async (req, res) => {
  const {
    name,
    categorie,
    besoin,
    quantite,
    technicien,
    isClosed,
    status,
    dateCloture,
    commentaire,
  } = req.body;

  try {
    // Create a new Fourniture with the provided fields
    const newFourniture = new Fourniture({
      name,
      categorie,
      besoin,
      quantite,
      technicien,
      isClosed,
      status,
      dateCloture,
      commentaire,
    });

    await newFourniture.save();
    res.status(201).json(newFourniture);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a Fourniture by ID
export const updateFourniture = async (req, res) => {
  console.log("Update Request Body:", req.body); // Debug log
  const {
    name,
    categorie,
    besoin,
    quantite,
    isClosed,
    status,
    dateCloture,
    commentaire,
  } = req.body;

  try {
    const updatedFourniture = await Fourniture.findByIdAndUpdate(
      req.params.id,
      {
        name,
        categorie,
        besoin,
        quantite,
        isClosed,
        status,
        dateCloture,
        commentaire,
      },
      { new: true }
    );

    if (!updatedFourniture) {
      return res.status(404).json({ message: "Fourniture not found" });
    }

    res.status(200).json(updatedFourniture);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a Fourniture by ID
export const deleteFourniture = async (req, res) => {
  try {
    const deletedFourniture = await Fourniture.findByIdAndDelete(req.params.id);

    if (!deletedFourniture) {
      return res.status(404).json({ message: "Fourniture not found" });
    }

    res.status(200).json({ message: "Fourniture deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
