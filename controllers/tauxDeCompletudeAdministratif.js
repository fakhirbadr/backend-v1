import TauxDeCompletudeAdministratif from "../models/tauxDeCompletudeAdministratifModel.js";

// Récupérer tous les taux de complétude administratif avec filtrage et calcul des taux
export const getAllTauxDeCompletudeAdministratif = async (req, res) => {
  const { region, province, unite } = req.query;

  try {
    const query = {};
    if (region) query.region = region;
    if (province) query.province = province;
    if (unite) query.unite = unite;

    const tauxHierarchiques = await TauxDeCompletudeAdministratif.aggregate([
      { $match: query }, // Filtre par région, province, unité
      {
        $addFields: {
          dateConverted: {
            $dateFromString: {
              dateString: "$date",
              format: "%Y-%m-%d",
              onError: new Date(0), // En cas d'erreur, utilise une date par défaut
            },
          },
        },
      },
      {
        $facet: {
          weekly: [
            {
              $addFields: {
                year: { $year: "$dateConverted" },
                week: { $week: "$dateConverted" },
              },
            },
            {
              $match: {
                tauxCompletudeAdministratif: { $ne: null }, // Filtre les documents valides
              },
            },
            {
              $group: {
                _id: {
                  region: "$region",
                  province: "$province",
                  unit: "$unite",
                  year: "$year",
                  week: "$week",
                },
                avg: { $avg: { $toDouble: "$tauxCompletudeAdministratif" } }, // Calcule la moyenne
              },
            },
            { $sort: { "_id.year": -1, "_id.week": -1 } }, // Trie par année et semaine
            {
              $group: {
                _id: {
                  region: "$_id.region",
                  province: "$_id.province",
                  unit: "$_id.unit",
                },
                averages: {
                  $push: { avg: "$avg", year: "$_id.year", week: "$_id.week" }, // Stocke les moyennes
                },
              },
            },
            {
              $project: {
                current: { $arrayElemAt: ["$averages", 0] }, // Moyenne actuelle
                previous: { $arrayElemAt: ["$averages", 1] }, // Moyenne précédente
              },
            },
            {
              $project: {
                region: "$_id.region",
                province: "$_id.province",
                unit: "$_id.unit",
                weeklyS: "$current.avg", // Moyenne hebdomadaire actuelle
                weeklyS1: "$previous.avg", // Moyenne hebdomadaire précédente
              },
            },
          ],
          monthly: [
            {
              $addFields: {
                year: { $year: "$dateConverted" },
                month: { $month: "$dateConverted" },
              },
            },
            {
              $match: {
                tauxCompletudeAdministratif: { $ne: null }, // Filtre les documents valides
              },
            },
            {
              $group: {
                _id: {
                  region: "$region",
                  province: "$province",
                  unit: "$unite",
                  year: "$year",
                  month: "$month",
                },
                avg: { $avg: { $toDouble: "$tauxCompletudeAdministratif" } }, // Calcule la moyenne
              },
            },
            { $sort: { "_id.year": -1, "_id.month": -1 } }, // Trie par année et mois
            {
              $group: {
                _id: {
                  region: "$_id.region",
                  province: "$_id.province",
                  unit: "$_id.unit",
                },
                averages: {
                  $push: {
                    avg: "$avg",
                    year: "$_id.year",
                    month: "$_id.month",
                  }, // Stocke les moyennes
                },
              },
            },
            {
              $project: {
                current: { $arrayElemAt: ["$averages", 0] }, // Moyenne actuelle
                previous: { $arrayElemAt: ["$averages", 1] }, // Moyenne précédente
              },
            },
            {
              $project: {
                region: "$_id.region",
                province: "$_id.province",
                unit: "$_id.unit",
                monthlyM: "$current.avg", // Moyenne mensuelle actuelle
                monthlyM1: "$previous.avg", // Moyenne mensuelle précédente
              },
            },
          ],
        },
      },
      {
        $project: {
          allResults: { $concatArrays: ["$weekly", "$monthly"] }, // Combine les résultats hebdomadaires et mensuels
        },
      },
      { $unwind: "$allResults" }, // Décompose le tableau en documents individuels
      { $replaceRoot: { newRoot: "$allResults" } }, // Remplace la racine par les résultats combinés
      {
        $group: {
          _id: {
            region: "$region",
            province: "$province",
            unit: "$unit",
          },
          weeklyS: { $max: "$weeklyS" }, // Récupère la moyenne hebdomadaire actuelle
          weeklyS1: { $max: "$weeklyS1" }, // Récupère la moyenne hebdomadaire précédente
          monthlyM: { $max: "$monthlyM" }, // Récupère la moyenne mensuelle actuelle
          monthlyM1: { $max: "$monthlyM1" }, // Récupère la moyenne mensuelle précédente
        },
      },
      {
        $group: {
          _id: {
            region: "$_id.region",
            province: "$_id.province",
          },
          unites: {
            $push: {
              unite: "$_id.unit",
              weeklyS: "$weeklyS",
              weeklyS1: "$weeklyS1",
              monthlyM: "$monthlyM",
              monthlyM1: "$monthlyM1",
            }, // Regroupe par province
          },
          provinceWeeklyS: { $avg: "$weeklyS" }, // Moyenne hebdomadaire par province
          provinceWeeklyS1: { $avg: "$weeklyS1" }, // Moyenne hebdomadaire précédente par province
          provinceMonthlyM: { $avg: "$monthlyM" }, // Moyenne mensuelle par province
          provinceMonthlyM1: { $avg: "$monthlyM1" }, // Moyenne mensuelle précédente par province
        },
      },
      {
        $group: {
          _id: "$_id.region",
          provinces: {
            $push: {
              province: "$_id.province",
              unites: "$unites",
              weeklyS: "$provinceWeeklyS",
              weeklyS1: "$provinceWeeklyS1",
              monthlyM: "$provinceMonthlyM",
              monthlyM1: "$provinceMonthlyM1",
            }, // Regroupe par région
          },
          regionWeeklyS: { $avg: "$provinceWeeklyS" }, // Moyenne hebdomadaire par région
          regionWeeklyS1: { $avg: "$provinceWeeklyS1" }, // Moyenne hebdomadaire précédente par région
          regionMonthlyM: { $avg: "$provinceMonthlyM" }, // Moyenne mensuelle par région
          regionMonthlyM1: { $avg: "$provinceMonthlyM1" }, // Moyenne mensuelle précédente par région
        },
      },
      {
        $project: {
          _id: 0,
          region: "$_id",
          provinces: 1,
          weeklyS: "$regionWeeklyS",
          weeklyS1: "$regionWeeklyS1",
          monthlyM: "$regionMonthlyM",
          monthlyM1: "$regionMonthlyM1",
        },
      },
    ]);

    res.status(200).json({ tauxHierarchiques });
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    res.status(500).json({
      message: "Erreur lors de la récupération des données",
      error: error.message,
    });
  }
};

// Créer plusieurs taux de complétude administratif
// Créer un taux de complétude administratif (simple ou multiple)
export const createTauxDeCompletudeAdministratif = async (req, res) => {
  const tauxData = req.body; // Données envoyées dans la requête (peuvent être un objet ou un tableau)

  try {
    // Vérifier si les données envoyées sont un tableau ou un objet unique
    if (Array.isArray(tauxData)) {
      // Si c'est un tableau, créer plusieurs documents à la fois
      if (tauxData.length === 0) {
        return res
          .status(400)
          .json({ message: "Le tableau de taux est vide." });
      }
      const newTaux = await TauxDeCompletudeAdministratif.insertMany(tauxData);
      return res.status(201).json(newTaux); // Retourner les documents créés
    } else {
      // Si ce n'est pas un tableau, créer un seul document
      const { date, region, province, unite, tauxCompletudeAdministratif } =
        tauxData;

      // Validation des champs requis
      if (
        !region ||
        !province ||
        !unite ||
        tauxCompletudeAdministratif === undefined
      ) {
        return res
          .status(400)
          .json({ message: "Tous les champs sont requis." });
      }

      const newTaux = new TauxDeCompletudeAdministratif({
        date,
        region,
        province,
        unite,
        tauxCompletudeAdministratif,
      });

      await newTaux.save();
      return res.status(201).json(newTaux); // Retourner le document créé
    }
  } catch (error) {
    console.error("Erreur lors de la création du taux :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
