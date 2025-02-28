import TauxDeSaisie from "../models/TauxDeSaisieModel.js";

//Get ALL

// Get ALL
export const getAllTauxDeSaisie = async (req, res) => {
  const { region, province, unite } = req.query;
  try {
    // Création d'un objet de filtrage en fonction des paramètres fournis
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
          taux: { $toDouble: "$TauxDeSaisie" },
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

    const tauxHierarchiques = await TauxDeSaisie.aggregate(pipeline);
    res.status(200).json({ tauxHierarchiques });
  } catch (error) {
    console.error("Erreur :", error);
    res.status(500).json({ error: error.message });
  }
};

// // Créer un taux de saisie (simple ou multiple)

export const createTauxDeSaisie = async (req, res) => {
  const tauxData = req.body;
  try {
    if (Array.isArray(tauxData)) {
      if (tauxData.length === 0) {
        return res.status(400).json({ message: "Aucune donnée fournie." });
      }
      const newTaux = await TauxDeSaisie.insertMany(tauxData);
      return res.status(201).json(newTaux);
    } else {
      const { date, region, province, unite, TauxDeSaisie } = tauxData;

      if (
        !date ||
        !region ||
        !province ||
        !unite ||
        TauxDeSaisie === undefined
      ) {
        return res
          .status(400)
          .json({ message: "Tous les champs sont requis." });
      }

      const newTaux = new TauxDeSaisie({
        date,
        region,
        province,
        unite,
        TauxDeSaisie,
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
