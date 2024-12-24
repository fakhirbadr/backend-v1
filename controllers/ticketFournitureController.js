import Fourniture from "../models/ticketFournitureModel.js";

// Get all Fournitures
// Get all Fournitures
export const getAllFournitures = async (req, res) => {
  try {
    // Récupérer les filtres depuis la requête
    const { isClosed, region, province, startDate, endDate, technicien, name } =
      req.query;

    // Crée une condition de filtre
    const filter = {};

    // Filtre par état "isClosed" si fourni
    if (isClosed !== undefined) {
      filter.isClosed = isClosed === "true";
    }

    // Filtre par name de l'actif
    if (name) {
      filter.name = name;
    }

    // Filtre par région si fourni
    if (region) {
      filter.region = region;
    }

    // Filtre par province si fourni
    if (province) {
      filter.province = province;
    }

    // Filtre par date si startDate et endDate sont fournis
    if (startDate && endDate) {
      filter.dateCreation = {
        $gte: new Date(startDate), // Utilise $gte pour les dates supérieures ou égales à startDate
        $lte: new Date(endDate), // Utilise $lte pour les dates inférieures ou égales à endDate
      };
    }

    // Filtre par technicien si fourni
    if (technicien) {
      filter.technicien = technicien;
    }

    // Récupérer les fournitures en fonction des filtres
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
    region,
    province,
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
      region,
      province,
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
    region,
    province,
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
        region,
        province,
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
