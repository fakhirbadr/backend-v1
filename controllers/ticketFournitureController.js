import Fourniture from "../models/ticketFournitureModel.js";

// Get all Fournitures
// Get all Fournitures
export const getAllFournitures = async (req, res) => {
  try {
    // Récupérer les filtres depuis la requête
    const {
      isClosed,
      region,
      province,
      startDate,
      endDate,
      technicien,
      name,
      categorie,
      besoin,
      status,
    } = req.query;

    // Crée une condition de filtre
    const filter = {};

    // Filtre par état "isClosed" si fourni
    if (isClosed !== undefined) {
      filter.isClosed = isClosed === "true";
    }

    // Filtre par name de l'actif si fourni
    if (name) {
      filter.name = name;
    }
    // Filtre par status si fourni
    if (status && status.startsWith("!")) {
      // Exclure un ou plusieurs statuts
      const excludedStatuses = status.substring(1).split(",");
      filter.status = { $nin: excludedStatuses };
    } else if (status) {
      // Inclure uniquement le statut spécifié
      filter.status = status;
    }

    // Filtre par région si fourni
    if (region) {
      filter.region = region;
    }

    // Filtre par province si fourni
    if (province) {
      filter.province = province;
    }

    // Filtre par besoin si fourni
    if (besoin) {
      filter.besoin = besoin;
    }

    // Ajoute un filtre pour "categorie" si présent
    if (categorie) {
      if (categorie.includes(",")) {
        // Si la région contient des virgules, filtrez pour plusieurs valeurs
        const categorie = categorie.split(",");
        filter.categorie = { $in: categorie };
      } else {
        // Sinon, filtrez pour une seule valeur
        filter.categorie = categorie;
      }
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

    // Utilise l'agrégation pour compter le nombre de tickets par catégorie
    const categoryCounts = await Fourniture.aggregate([
      { $match: filter }, // Applique les filtres de recherche
      {
        $group: {
          _id: "$categorie", // Regroupe par catégorie
          count: { $sum: 1 }, // Compte le nombre de tickets par catégorie
          totalResolutionTime: {
            $sum: { $subtract: ["$dateCloture", "$dateCreation"] },
          }, // Somme des temps de résolution
          totalClosed: {
            $sum: { $cond: [{ $eq: ["$isClosed", true] }, 1, 0] },
          }, // Nombre de tickets fermés
        },
      },
      {
        $project: {
          count: 1,
          averageResolutionTime: {
            $cond: [
              { $eq: ["$totalClosed", 0] },
              0,
              { $divide: ["$totalResolutionTime", "$totalClosed"] },
            ],
          }, // Moyenne du temps de résolution
        },
      },
      { $sort: { count: -1 } }, // Optionnel : trier les résultats par nombre de tickets décroissant
    ]);

    // Calcul du total des fournitures
    const total = categoryCounts.reduce(
      (sum, category) => sum + category.count,
      0
    );

    // Ajoutez l'agrégation pour compter les tickets fermés par catégorie (isClosed = true)
    const closedCategoryCounts = await Fourniture.aggregate([
      { $match: { ...filter, isClosed: true } }, // Filtrer les tickets fermés
      {
        $group: {
          _id: "$categorie", // Regroupe par catégorie
          count: { $sum: 1 }, // Compte le nombre de tickets fermés par catégorie
        },
      },
      { $sort: { count: -1 } }, // Optionnel : trier les résultats par nombre de tickets fermés décroissant
    ]);
    // Ajoutez l'agrégation pour compter les tickets fermés par catégorie (isClosed = true)
    const inclosedCategoryCounts = await Fourniture.aggregate([
      { $match: { ...filter, isClosed: false } }, // Filtrer les tickets fermés
      {
        $group: {
          _id: "$categorie", // Regroupe par catégorie
          count: { $sum: 1 }, // Compte le nombre de tickets fermés par catégorie
        },
      },
      { $sort: { count: -1 } }, // Optionnel : trier les résultats par nombre de tickets fermés décroissant
    ]);
    // Ajoutez l'agrégation pour les tickets non clôturés par type de besoin dans chaque catégorie
    const nonClosedByNeedAndCategory = await Fourniture.aggregate([
      { $match: { ...filter, isClosed: false } }, // Filtrer uniquement les tickets non clôturés
      {
        $group: {
          _id: { categorie: "$categorie", besoin: "$besoin" }, // Grouper par catégorie et type de besoin
          count: { $sum: 1 }, // Compter le nombre de tickets
        },
      },
      { $sort: { "_id.categorie": 1, "_id.besoin": 1 } }, // Optionnel : trier les résultats
    ]);

    // Reformatez les données pour qu'elles soient plus faciles à utiliser dans le frontend
    const nonClosedByNeedAndCategoryFormatted =
      nonClosedByNeedAndCategory.reduce((acc, { _id, count }) => {
        const { categorie, besoin } = _id;
        if (!acc[categorie]) {
          acc[categorie] = [];
        }
        acc[categorie].push({ besoin, count });
        return acc;
      }, {});
    // Calcul du total des tickets fermés
    const totalClosed = closedCategoryCounts.reduce(
      (sum, category) => sum + category.count,
      0
    );
    const totalInclosed = inclosedCategoryCounts.reduce(
      (sum, category) => sum + category.count,
      0
    );
    const closureRate =
      total > 0 ? ((totalClosed / total) * 100).toFixed(2) : 0;

    // Ajout du calcul du pourcentage de tickets fermés par catégorie
    const categoryPercentages = categoryCounts.map((category) => {
      // Trouver le nombre de tickets fermés pour cette catégorie
      const closedCategory = closedCategoryCounts.find(
        (closed) => closed._id === category._id
      );

      const closedCount = closedCategory ? closedCategory.count : 0;

      // Calcul du pourcentage
      const closedPercentage =
        category.count > 0
          ? ((closedCount / category.count) * 100).toFixed(2) // En pourcentage
          : 0;

      return {
        ...category,
        closedPercentage, // Ajoute le pourcentage à chaque catégorie
      };
    });
    // Calcul du total de clôturation pour tous les tickets

    // Récupérer les fournitures en fonction des filtres
    const fournitures = await Fourniture.find(filter);

    // Retourne les résultats avec les comptes par catégorie, les fournitures, le total et les tickets fermés
    res.status(200).json({
      categoryCounts: categoryPercentages, // Utilise les catégories avec pourcentages
      fournitures,
      total,
      closedCategoryCounts,
      totalClosed,
      closureRate,
      inclosedCategoryCounts,
      totalInclosed,
      nonClosedByNeedAndCategory: nonClosedByNeedAndCategoryFormatted,
    });
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
