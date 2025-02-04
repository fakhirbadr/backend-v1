import Reclamation from "../models/reclamationModel.js"; // Import your model

// Get all reclamations
export const getAllReclamations = async (req, res) => {
  try {
    const reclamations = await Reclamation.find(); // Fetch all reclamations
    res.status(200).json(reclamations); // Respond with the data
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching reclamations", error: err });
  }
};

// Get a reclamation by ID
export const getReclamationById = async (req, res) => {
  try {
    const reclamation = await Reclamation.findById(req.params.id); // Fetch reclamation by ID
    if (!reclamation) {
      return res.status(404).json({ message: "Reclamation not found" });
    }
    res.status(200).json(reclamation); // Respond with the data
  } catch (err) {
    res.status(500).json({ message: "Error fetching reclamation", error: err });
  }
};

// Create a new reclamation
export const createReclamation = async (req, res) => {
  const {
    user,
    site,
    region,
    province,
    typeReclamation,
    commentaire,
    etatReclamation,
    commentaireResponsable,
    dateFermetureTicket,
  } = req.body;

  try {
    const newReclamation = new Reclamation({
      user,
      site,
      region,
      province,
      typeReclamation,
      commentaire,
      etatReclamation,
      commentaireResponsable,
      dateFermetureTicket,
    });

    // Save the new reclamation to the database
    await newReclamation.save();
    res.status(201).json(newReclamation); // Respond with the created reclamation
  } catch (err) {
    res.status(500).json({ message: "Error creating reclamation", error: err });
  }
};
