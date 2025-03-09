import TestSpeedNetwork from "../models/testSpeedNetworkModel.js";

// GET all test speed network records
export const getAllTestSpeedNetworks = async (req, res) => {
  try {
    const { nomComplet, testHoraire, date } = req.query; // Récupérer les paramètres depuis la requête

    let query = {};

    // Filtre par nomComplet
    if (nomComplet) {
      query.nomComplet = { $regex: nomComplet, $options: "i" }; // Recherche insensible à la casse
    }

    // Filtre par testHoraire
    if (testHoraire) {
      query.testHoraire = testHoraire; // Recherche exacte ou autre traitement selon besoin
    }

    // Calculer la date d'il y a deux jours
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    // Filtre par date pour les deux derniers jours
    query.date = { $gte: twoDaysAgo };

    const testSpeedNetworks = await TestSpeedNetwork.find(query);
    res.status(200).json(testSpeedNetworks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des données", error });
  }
};

// GET a single test speed network record by ID
export const getTestSpeedNetworkById = async (req, res) => {
  const { id } = req.params;
  try {
    const testSpeedNetwork = await TestSpeedNetwork.findById(id);
    if (!testSpeedNetwork) {
      return res.status(404).json({ message: "TestSpeedNetwork non trouvé" });
    }
    res.status(200).json(testSpeedNetwork);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des données", error });
  }
};

// POST a new test speed network record
export const createTestSpeedNetwork = async (req, res) => {
  const {
    user,
    unite,
    region,
    province,
    date,
    heure,
    download,
    upload,
    idUser,
    nomComplet,
    testHoraire,
    patientsWaiting,
  } = req.body;

  try {
    const newTestSpeedNetwork = new TestSpeedNetwork({
      user,
      unite,
      region,
      province,
      date,
      heure,
      download,
      upload,
      idUser,
      nomComplet,
      testHoraire,
      patientsWaiting,
    });

    // Save the new record
    const savedTestSpeedNetwork = await newTestSpeedNetwork.save();
    res.status(201).json(savedTestSpeedNetwork);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la création des données", error });
  }
};
