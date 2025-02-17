import tauxCompletude from "../models/TauxDeCompletudeMedicalModel.js";

export const getAllTauxCompletude = async (req, res) => {
  const { region, province, unite } = req.query;

  try {
    const query = {};
    if (region) query.region = region;
    if (province) query.province = province;
    if (unite) query.unite = unite;

    const tauxHierarchiques = await tauxCompletude.aggregate([
      { $match: query },
      {
        $addFields: {
          dateConverted: {
            $dateFromString: {
              dateString: "$date",
              onError: new Date(0),
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
              $group: {
                _id: {
                  region: "$region",
                  province: "$province",
                  unit: "$unite",
                  year: "$year",
                  week: "$week",
                },
                avg: { $avg: { $toDouble: "$tauxCompletudeMedical" } },
              },
            },
            { $sort: { "_id.year": -1, "_id.week": -1 } },
            {
              $group: {
                _id: {
                  region: "$_id.region",
                  province: "$_id.province",
                  unit: "$_id.unit",
                },
                averages: {
                  $push: { avg: "$avg", year: "$_id.year", week: "$_id.week" },
                },
              },
            },
            {
              $project: {
                current: { $arrayElemAt: ["$averages", 0] },
                previous: { $arrayElemAt: ["$averages", 1] },
              },
            },
            {
              $project: {
                region: "$_id.region",
                province: "$_id.province",
                unit: "$_id.unit",
                weeklyS: "$current.avg",
                weeklyS1: "$previous.avg",
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
              $group: {
                _id: {
                  region: "$region",
                  province: "$province",
                  unit: "$unite",
                  year: "$year",
                  month: "$month",
                },
                avg: { $avg: { $toDouble: "$tauxCompletudeMedical" } },
              },
            },
            { $sort: { "_id.year": -1, "_id.month": -1 } },
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
                  },
                },
              },
            },
            {
              $project: {
                current: { $arrayElemAt: ["$averages", 0] },
                previous: { $arrayElemAt: ["$averages", 1] },
              },
            },
            {
              $project: {
                region: "$_id.region",
                province: "$_id.province",
                unit: "$_id.unit",
                monthlyM: "$current.avg",
                monthlyM1: "$previous.avg",
              },
            },
          ],
        },
      },
      {
        $project: {
          allResults: { $concatArrays: ["$weekly", "$monthly"] },
        },
      },
      { $unwind: "$allResults" },
      { $replaceRoot: { newRoot: "$allResults" } },
      {
        $group: {
          _id: {
            region: "$region",
            province: "$province",
            unit: "$unit",
          },
          weeklyS: { $max: "$weeklyS" },
          weeklyS1: { $max: "$weeklyS1" },
          monthlyM: { $max: "$monthlyM" },
          monthlyM1: { $max: "$monthlyM1" },
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
            },
          },
          provinceWeeklyS: { $avg: "$weeklyS" },
          provinceWeeklyS1: { $avg: "$weeklyS1" },
          provinceMonthlyM: { $avg: "$monthlyM" },
          provinceMonthlyM1: { $avg: "$monthlyM1" },
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
            },
          },
          regionWeeklyS: { $avg: "$provinceWeeklyS" },
          regionWeeklyS1: { $avg: "$provinceWeeklyS1" },
          regionMonthlyM: { $avg: "$provinceMonthlyM" },
          regionMonthlyM1: { $avg: "$provinceMonthlyM1" },
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
    res.status(500).json({
      message: "Erreur lors de la récupération des données",
      error,
    });
  }
};

// Créer plusieurs enregistrements de taux de complétude
export const creatTauxCompletude = async (req, res) => {
  try {
    // Récupérer le tableau d'objets depuis le corps de la requête
    const tauxCompletudeArray = req.body;

    // Vérifier si les données reçues sont un tableau non vide
    if (
      !Array.isArray(tauxCompletudeArray) ||
      tauxCompletudeArray.length === 0
    ) {
      return res.status(400).json({
        message: "Veuillez fournir un tableau d'enregistrements valide.",
      });
    }

    // Insérer les enregistrements dans la base de données
    const newTauxCompletude = await tauxCompletude.insertMany(
      tauxCompletudeArray
    );

    // Retourner les enregistrements créés avec un statut 201 (création réussie)
    res.status(201).json(newTauxCompletude);
  } catch (error) {
    // Gérer l'erreur en cas de problème avec l'insertion
    res.status(500).json({
      message: "Erreur lors de la création des enregistrements",
      error,
    });
  }
};
