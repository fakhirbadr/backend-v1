import TauxDeCompletudeDeDossierComplet from "../models/tauxDeCompletudeDeDossierCompletModel.js";

// Récupérer tous les taux de complétude administratif avec filtrage et calcul des taux
export const getAllTauxDeCompletudeDeDossierComplet = async (req, res) => {
  const { region, province, unite } = req.query;

  try {
    const matchQuery = {};
    if (region) matchQuery.region = region;
    if (province) matchQuery.province = province;
    if (unite) matchQuery.unite = unite;

    const pipeline = [
      { $match: matchQuery },
      {
        $addFields: {
          date: {
            $dateFromString: {
              dateString: "$date",
              format: "%Y-%m-%d",
              onError: null,
            },
          },
          taux: { $toDouble: "$TauxDeCompletudeDeDossierComplet" },
        },
      },
      {
        $facet: {
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
          allData: {
            $concatArrays: ["$currentWeek", "$previousWeek", "$previousMonth"],
          },
        },
      },
      { $unwind: "$allData" },
      { $replaceRoot: { newRoot: "$allData" } },
      {
        $group: {
          _id: {
            region: "$region",
            province: "$province",
            unite: "$unite",
            periodType: {
              $switch: {
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
          avgTaux: { $avg: "$taux" },
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
          monthlyM: {
            $max: { $cond: [{ $eq: ["$_id.periodType", "S"] }, "$avgTaux", 0] },
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
              monthlyM: "$monthlyM",
              monthlyM1: "$monthlyM1",
            },
          },
          provinceS: { $avg: "$weeklyS" },
          provinceS1: { $avg: "$weeklyS1" },
          provinceM: { $avg: "$monthlyM" },
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
              monthlyM: "$provinceM",
              monthlyM1: "$provinceM1",
            },
          },
          regionS: { $avg: "$provinceS" },
          regionS1: { $avg: "$provinceS1" },
          regionM: { $avg: "$provinceM" }, // Ajouté
          regionM1: { $avg: "$provinceM1" }, // Existant
        },
      },
      {
        $project: {
          _id: 0,
          region: "$_id",
          provinces: 1,
          // Ajouter tous les indicateurs régionaux
          weeklyS: "$regionS",
          weeklyS1: "$regionS1",
          monthlyM: "$regionM", // Nouveau
          monthlyM1: "$regionM1",
        },
      },
    ];

    const tauxHierarchiques = await TauxDeCompletudeDeDossierComplet.aggregate(
      pipeline
    );

    res.status(200).json({ tauxHierarchiques });
  } catch (error) {
    console.error("Erreur :", error);
    res.status(500).json({ error: error.message });
  }
};

// Créer plusieurs taux de complétude administratif
// Créer un taux de complétude administratif (simple ou multiple)
export const createTauxDeCompletudeDeDossierComplet = async (req, res) => {
  const tauxData = req.body;

  try {
    if (Array.isArray(tauxData)) {
      if (tauxData.length === 0) {
        return res
          .status(400)
          .json({ message: "Le tableau de taux est vide." });
      }
      const newTaux = await TauxDeCompletudeDeDossierComplet.insertMany(
        tauxData
      );
      return res.status(201).json(newTaux);
    } else {
      // Destructuration CORRIGÉE avec "T" majuscule
      const {
        date,
        region,
        province,
        unite,
        TauxDeCompletudeDeDossierComplet, // ✅
      } = tauxData;

      // Validation CORRIGÉE avec "T" majuscule
      if (
        !region ||
        !province ||
        !unite ||
        TauxDeCompletudeDeDossierComplet === undefined // ✅
      ) {
        return res
          .status(400)
          .json({ message: "Tous les champs sont requis." });
      }

      // Création CORRIGÉE avec "T" majuscule
      const newTaux = new TauxDeCompletudeDeDossierComplet({
        date,
        region,
        province,
        unite,
        TauxDeCompletudeDeDossierComplet: TauxDeCompletudeDeDossierComplet, // ✅
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
