import InactiveUmmc from "../models/ummcInactiveModel.js";

// GET all records
export const getAllInactiveUmmc = async (req, res) => {
  try {
    const records = await InactiveUmmc.find();
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// POST a new record
export const createInactiveUmmc = async (req, res) => {
  try {
    const {
      date,
      unite,
      region,
      province,
      raison,
      technicien,
      CloseAt,
      CloseTo,
    } = req.body;

    // Validation simple des champs obligatoires
    if (!date || !CloseAt || !CloseTo) {
      return res
        .status(400)
        .json({ message: "Les champs date, CloseAt et CloseTo sont requis." });
    }

    const newRecord = new InactiveUmmc({
      date,
      unite,
      region,
      province,
      technicien,
      raison,
      CloseAt,
      CloseTo,
    });

    await newRecord.save();
    res
      .status(201)
      .json({ message: "Donnée ajoutée avec succès", data: newRecord });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
