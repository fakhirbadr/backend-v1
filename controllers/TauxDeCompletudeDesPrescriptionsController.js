import TauxDeCompletudeDesPrescriptions from "../models/TauxDeCompletudeDesPrescriptionsModel.js";

// GET ALL
export const getAllTauxDeCompletudeDesPrescriptions = async (req, res) => {
  const { region, province, unite } = req.query;

  try {
    // Création d'un objet de filtrage en fonction des paramètres fournis
    const matchQuery = {};
    if (region) matchQuery.region = region;
    if (province) matchQuery.province = province;
    if (unite) matchQuery.unite = unite;

    const pipeline = [
      { $match: matchQuery }, // Filtrer les données en fonction des critères
      {
        $addFields: {
          date: {
            $dateFromString: {
              // Correction de l'opérateur $dateFromString (anciennement mal orthographié)
              dateString: "$date",
              format: "%Y-%m-%d",
              onError: null,
            },
          },
          taux: { $toDouble: "$TauxDeCompletudeDesPrescriptions" },
        },
      },
      {
        $facet: {
          // Séparer les données en différentes périodes de temps
          currentWeek: [
            {
              $match: {
                date: {
                  $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
                  $lte: new Date(),
                },
              },
            },
          ],
          previousWeek: [
            {
              $match: {
                date: {
                  $gte: new Date(new Date().setDate(new Date().getDate() - 14)),
                  $lt: new Date(new Date().setDate(new Date().getDate() - 7)),
                },
              },
            },
          ],
          previousMonth: [
            {
              $match: {
                date: {
                  $gte: new Date(
                    new Date().setMonth(new Date().getMonth() - 1)
                  ),
                  $lt: new Date(),
                },
              },
            },
          ],
        },
      },
      {
        $project: {
          // Correction de la clé $project (anciennement mal orthographiée $porject)
          allData: {
            $concatArrays: ["$currentWeek", "$previousWeek", "$previousMonth"],
          },
        },
      },
      { $unwind: "$allData" }, // Transformer la liste en documents individuels
      { $replaceRoot: { newRoot: "$allData" } },
      {
        $group: {
          _id: {
            region: "$region",
            province: "$province",
            unite: "$unite",
            periodType: {
              $switch: {
                // Catégoriser les données selon la période
                branches: [
                  {
                    case: {
                      $and: [
                        {
                          $gte: [
                            "$date",
                            new Date(
                              new Date().setDate(new Date().getDate() - 7)
                            ),
                          ],
                        },
                        { $lte: ["$date", new Date()] },
                      ],
                    },
                    then: "S",
                  },
                  {
                    case: {
                      $and: [
                        {
                          $gte: [
                            "$date",
                            new Date(
                              new Date().setDate(new Date().getDate() - 14)
                            ),
                          ],
                        },
                        {
                          $lt: [
                            "$date",
                            new Date(
                              new Date().setDate(new Date().getDate() - 7)
                            ),
                          ],
                        },
                      ],
                    },
                    then: "S1",
                  },
                  {
                    case: {
                      $gte: [
                        "$date",
                        new Date(
                          new Date().setMonth(new Date().getMonth() - 1)
                        ),
                      ],
                    },
                    then: "M1",
                  },
                ],
                default: "other",
              },
            },
          },
          avgTaux: { $avg: "$taux" }, // Calculer la moyenne du taux
        },
      },
      {
        $group: {
          _id: {
            region: "$_id.region",
            province: "$_id.province",
            unite: "$_id.unite",
          },
          weeklyS: {
            $max: { $cond: [{ $eq: ["$_id.periodType", "S"] }, "$avgTaux", 0] },
          },
          weeklyS1: {
            $max: {
              $cond: [{ $eq: ["$_id.periodType", "S1"] }, "$avgTaux", 0],
            },
          },
          monthlyM1: {
            $max: {
              $cond: [{ $eq: ["$_id.periodType", "M1"] }, "$avgTaux", 0],
            },
          },
        },
      },
      {
        $group: {
          _id: { region: "$_id.region", province: "$_id.province" },
          unites: {
            $push: {
              unite: "$_id.unite",
              weeklyS: "$weeklyS",
              weeklyS1: "$weeklyS1",
              monthlyM1: "$monthlyM1",
            },
          },
          provinceS: { $avg: "$weeklyS" },
          provinceS1: { $avg: "$weeklyS1" },
          provinceM1: { $avg: "$monthlyM1" },
        },
      },
      {
        $group: {
          _id: "$_id.region",
          provinces: {
            $push: {
              province: "$_id.province",
              unites: "$unites",
              weeklyS: "$provinceS",
              weeklyS1: "$provinceS1",
              monthlyM1: "$provinceM1",
            },
          },
          regionS: { $avg: "$provinceS" },
          regionS1: { $avg: "$provinceS1" },
          regionM1: { $avg: "$provinceM1" },
        },
      },
      {
        $project: {
          _id: 0,
          region: "$_id",
          provinces: 1,
          weeklyS: "$regionS",
          weeklyS1: "$regionS1",
          monthlyM1: "$regionM1",
        },
      },
    ];

    // Exécution du pipeline d'agrégation
    const tauxHierarchiques = await TauxDeCompletudeDesPrescriptions.aggregate(
      pipeline
    );

    res.status(200).json({ tauxHierarchiques });
  } catch (error) {
    console.error("Erreur :", error);
    res.status(500).json({ error: error.message });
  }
};

// // Créer un taux de complétude administratif (simple ou multiple)

export const createTauxDeCompletudeDesPrescriptions = async (req, res) => {
  const tauxData = req.body;
  try {
    if (Array.isArray(tauxData)) {
      if (tauxData.length === 0) {
        return res.status(400).json({ message: "Aucune donnée fournie." });
      }
      const newTaux = await TauxDeCompletudeDesPrescriptions.insertMany(
        tauxData
      );
      return res.status(201).json(newTaux);
    } else {
      const {
        date,
        region,
        province,
        unite,
        TauxDeCompletudeDesPrescriptions,
      } = tauxData;

      if (
        !region ||
        !province ||
        !unite ||
        TauxDeCompletudeDesPrescriptions === undefined
      ) {
        return res
          .status(400)
          .json({ message: "Tous les champs sont requis." });
      }

      const newTaux = new TauxDeCompletudeDesPrescriptions({
        date,
        region,
        province,
        unite,
        TauxDeCompletudeDesPrescriptions,
      });

      await newTaux.save();
      return res.status(201).json(newTaux);
    }
  } catch (error) {
    console.error("Erreur lors de la création du taux :", error);
    res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
};
