import ummcperformance from "../models/ummcperformanceModel.js";

// Fonction pour récupérer toutes les données (GET)
export const getAllUmmcPerformance = async (req, res) => {
  try {
    // Récupérer les paramètres de requête
    const { region, province, unite, dateDebut, dateFin } = req.query;

    // Construire le filtre de base
    const filter = {};
    if (region) filter.region = region;
    if (province) filter.province = province;
    if (unite) filter.unite = unite;

    // Récupérer toutes les données sans filtrer par date (car les dates sont des strings)
    const data = await ummcperformance.find(filter);

    // Convertir les dates en objets Date et filtrer manuellement
    let filteredData = data.map((entry) => ({
      ...entry._doc, // Utiliser ._doc pour accéder aux données brutes de Mongoose
      date: new Date(entry.date), // Convertir la date en objet Date
    }));

    // Appliquer le filtre de date manuellement
    if (dateDebut) {
      filteredData = filteredData.filter(
        (entry) => entry.date >= new Date(dateDebut)
      );
    }
    if (dateFin) {
      filteredData = filteredData.filter(
        (entry) => entry.date <= new Date(dateFin)
      );
    }
    // Extraire les valeurs uniques pour les filtres disponibles
    const regions = [...new Set(filteredData.map((entry) => entry.region))]
      .filter(Boolean)
      .sort();

    const provinces = [...new Set(filteredData.map((entry) => entry.province))]
      .filter(Boolean)
      .sort();

    const unites = [...new Set(filteredData.map((entry) => entry.unite))]
      .filter(Boolean)
      .sort();

    // Initialiser les variables pour les calculs
    let totalPriseEnCharge = 0;
    let totalHomme = 0;
    let totalFemme = 0;
    const ageRanges = {
      "0-6": 0,
      "7-14": 0,
      "15-24": 0,
      "25-64": 0,
      "65-100": 0,
    };
    const serviceCounts = {
      Consultation: 0,
      Soins: 0,
      Vaccination: 0,
      Teleexpertises: 0,
      DepistageDiabete: 0,
      DepistageHTA: 0,
      DepistageCancerDuSein: 0,
      Transfert: 0,
      Urgence: 0,
    };
    const pathologyCounts = {};

    // Parcourir les données filtrées pour effectuer les calculs
    filteredData.forEach((entry) => {
      totalPriseEnCharge += entry.totalPriseEnCharge || 0;
      totalHomme += entry.Homme || 0;
      totalFemme += entry.Femme || 0;

      // Calculer les tranches d'âge
      ageRanges["0-6"] += entry.ageGroup0to6 || 0;
      ageRanges["7-14"] += entry.ageGroup7to14 || 0;
      ageRanges["15-24"] += entry.ageGroup15to24 || 0;
      ageRanges["25-64"] += entry.ageGroup25to64 || 0;
      ageRanges["65-100"] += entry.ageGroup65to100 || 0;

      // Calculer les services
      serviceCounts.Consultation += entry.Consultation || 0;
      serviceCounts.Soins += entry.soins || 0;
      serviceCounts.Vaccination += entry.Vaccination || 0;
      serviceCounts.Teleexpertises += entry.Teleexpertises || 0;
      serviceCounts.DepistageDiabete += entry.DepistageDiabete || 0;
      serviceCounts.DepistageHTA += entry.DepistageHTA || 0;
      serviceCounts.DepistageCancerDuSein += entry.DepistageCancerDuSein || 0;
      serviceCounts.Transfert += entry.Transfert || 0;
      serviceCounts.Urgence += entry.Urgence || 0;

      // Calculer les pathologies fréquentes
      for (let i = 1; i <= 5; i++) {
        const pathology = entry[`PathologieFrequente${i}`];
        if (pathology) {
          pathologyCounts[pathology] = (pathologyCounts[pathology] || 0) + 1;
        }
      }
    });

    // Calculer le total des pathologies
    const totalPathologies = Object.values(pathologyCounts).reduce(
      (sum, count) => sum + count,
      0
    );

    // Trier les pathologies par fréquence et garder les 15 premières
    const sortedPathologies = Object.entries(pathologyCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([pathology, count]) => ({
        pathology,
        count,
        rate:
          totalPathologies > 0
            ? ((count / totalPathologies) * 100).toFixed(2)
            : "0.00",
      }));

    // Calculer les taux par tranche d'âge
    const ageRates = totalPriseEnCharge
      ? {
          "0-6": ((ageRanges["0-6"] / totalPriseEnCharge) * 100).toFixed(2),
          "7-14": ((ageRanges["7-14"] / totalPriseEnCharge) * 100).toFixed(2),
          "15-24": ((ageRanges["15-24"] / totalPriseEnCharge) * 100).toFixed(2),
          "25-64": ((ageRanges["25-64"] / totalPriseEnCharge) * 100).toFixed(2),
          "65-100": ((ageRanges["65-100"] / totalPriseEnCharge) * 100).toFixed(
            2
          ),
        }
      : {
          "0-6": "0.00",
          "7-14": "0.00",
          "15-24": "0.00",
          "25-64": "0.00",
          "65-100": "0.00",
        };

    // Calculer les taux par service
    const serviceRates = totalPriseEnCharge
      ? {
          Consultation: (
            (serviceCounts.Consultation / totalPriseEnCharge) *
            100
          ).toFixed(2),
          Soins: ((serviceCounts.Soins / totalPriseEnCharge) * 100).toFixed(2),
          Vaccination: (
            (serviceCounts.Vaccination / totalPriseEnCharge) *
            100
          ).toFixed(2),
          Teleexpertises: (
            (serviceCounts.Teleexpertises / totalPriseEnCharge) *
            100
          ).toFixed(2),
          DepistageDiabete: (
            (serviceCounts.DepistageDiabete / totalPriseEnCharge) *
            100
          ).toFixed(2),
          DepistageHTA: (
            (serviceCounts.DepistageHTA / totalPriseEnCharge) *
            100
          ).toFixed(2),
          DepistageCancerDuSein: (
            (serviceCounts.DepistageCancerDuSein / totalPriseEnCharge) *
            100
          ).toFixed(2),
          Transfert: (
            (serviceCounts.Transfert / totalPriseEnCharge) *
            100
          ).toFixed(2),
          Urgence: ((serviceCounts.Urgence / totalPriseEnCharge) * 100).toFixed(
            2
          ),
        }
      : {
          Consultation: "0.00",
          Soins: "0.00",
          Vaccination: "0.00",
          Teleexpertises: "0.00",
          DepistageDiabete: "0.00",
          DepistageHTA: "0.00",
          DepistageCancerDuSein: "0.00",
          Transfert: "0.00",
          Urgence: "0.00",
        };

    // Préparer les données des services pour la réponse
    const servicesData = Object.keys(serviceCounts).map((serviceName) => ({
      serviceName,
      cases: serviceCounts[serviceName],
      serviceRate: serviceRates[serviceName],
    }));

    // Calculer les taux par genre
    const genderRates = totalPriseEnCharge
      ? {
          Homme: ((totalHomme / totalPriseEnCharge) * 100).toFixed(2),
          Femme: ((totalFemme / totalPriseEnCharge) * 100).toFixed(2),
        }
      : {
          Homme: "0.00",
          Femme: "0.00",
        };

    // Renvoyer la réponse sans les données brutes
    res.status(200).json({
      totalPriseEnCharge,
      totalHomme,
      totalFemme,
      genderRates,
      ageRates,
      servicesData,
      topPathologies: sortedPathologies,
      availableFilters: {
        regions,
        provinces,
        unites,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const getTeleexpertise = async (req, res) => {
  try {
    const data = await ummcperformance.aggregate([
      {
        $group: {
          _id: { region: "$region", province: "$province", unite: "$unite" },
          totalTeleexpertises: { $sum: "$Teleexpertises" },
          totalPriseEnCharge: { $sum: "$totalPriseEnCharge" },
        },
      },
      {
        $group: {
          _id: { region: "$_id.region", province: "$_id.province" },
          unites: {
            $push: {
              unite: "$_id.unite",
              tauxTeleexpertise: {
                $cond: {
                  if: { $gt: ["$totalPriseEnCharge", 0] },
                  then: {
                    $round: [
                      {
                        $multiply: [
                          {
                            $divide: [
                              "$totalTeleexpertises",
                              "$totalPriseEnCharge",
                            ],
                          },
                          100,
                        ],
                      },
                      2,
                    ],
                  },
                  else: 0,
                },
              },
            },
          },
          totalTeleexpertisesProvince: { $sum: "$totalTeleexpertises" },
          totalPriseEnChargeProvince: { $sum: "$totalPriseEnCharge" },
        },
      },
      {
        $group: {
          _id: { region: "$_id.region" },
          provinces: {
            $push: {
              province: "$_id.province",
              tauxTeleexpertiseProvince: {
                $cond: {
                  if: { $gt: ["$totalPriseEnChargeProvince", 0] },
                  then: {
                    $round: [
                      {
                        $multiply: [
                          {
                            $divide: [
                              "$totalTeleexpertisesProvince",
                              "$totalPriseEnChargeProvince",
                            ],
                          },
                          100,
                        ],
                      },
                      2,
                    ],
                  },
                  else: 0,
                },
              },
              unites: "$unites",
            },
          },
          totalTeleexpertisesRegion: { $sum: "$totalTeleexpertisesProvince" },
          totalPriseEnChargeRegion: { $sum: "$totalPriseEnChargeProvince" },
        },
      },
      {
        $project: {
          _id: 0,
          region: "$_id.region",
          tauxTeleexpertiseRegion: {
            $cond: {
              if: { $gt: ["$totalPriseEnChargeRegion", 0] },
              then: {
                $round: [
                  {
                    $multiply: [
                      {
                        $divide: [
                          "$totalTeleexpertisesRegion",
                          "$totalPriseEnChargeRegion",
                        ],
                      },
                      100,
                    ],
                  },
                  2,
                ],
              },
              else: 0,
            },
          },
          provinces: 1,
        },
      },
    ]);

    res.status(200).json(data);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des télé-expertises :",
      error
    );
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const getPathologyPercentages = async (req, res) => {
  try {
    const records = await ummcperformance.find();
    if (records.length === 0) {
      return res.status(404).json({ message: "No records found" });
    }

    let pathologyCounts = {};
    let totalCount = 0;

    // Compter les occurrences de chaque pathologie
    records.forEach((record) => {
      [
        record.PathologieFrequente1,
        record.PathologieFrequente2,
        record.PathologieFrequente3,
        record.PathologieFrequente4,
        record.PathologieFrequente5,
      ].forEach((pathology) => {
        if (pathology && pathology.trim() !== "") {
          pathologyCounts[pathology] = (pathologyCounts[pathology] || 0) + 1;
          totalCount++;
        }
      });
    });

    // Transformer les données en tableau et trier par fréquence décroissante
    const pathologyPercentages = Object.entries(pathologyCounts)
      .map(([pathology, count]) => ({
        pathology,
        percentage: ((count / totalCount) * 100).toFixed(2) + "%",
        count, // Ajouter le nombre d'occurrences pour le tri
      }))
      .sort((a, b) => b.count - a.count) // Trier par ordre décroissant
      .slice(0, 20) // Limiter aux 20 premiers
      .map(({ pathology, percentage }) => ({ pathology, percentage })); // Retirer le champ "count"

    res.status(200).json(pathologyPercentages);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Fonction pour ajouter de nouvelles données (POST)
export const createUmmcPerformance = async (req, res) => {
  try {
    const data = req.body;

    // Vérifier si les données reçues sont un tableau
    if (Array.isArray(data)) {
      // Si c'est un tableau, insérer plusieurs entrées
      await ummcperformance.insertMany(data);
      return res
        .status(201)
        .json({ message: "Données multiples ajoutées avec succès" });
    } else {
      // Si ce n'est pas un tableau, insérer une seule entrée
      const {
        date,
        region,
        province,
        unite,
        totalPriseEnCharge,
        effectifTotalOperationnel,
        totalUMMCInstallees,
        ConsultationMedcineGenerale,
        Referencement,
        Evacuation,
        ageGroup0to6,
        ageGroup7to14,
        ageGroup15to24,
        ageGroup25to64,
        ageGroup65to100,
        Consultation,
        soins,
        Vaccination,
        Teleexpertises,
        DepistageDiabete,
        DepistageHTA,
        DepistageCancerDuSein,
        DepistageDuCancerDuCol,
        TestCovid19Positif,
        TestCovid19Negatif,
        CasDeRougeole,
        Oreillon,
        SuiviDeGrossesse,
        GrossesseARisque,
        Femme,
        Homme,
        Transfert,
        Urgence,
        PathologieFrequente1,
        PathologieFrequente2,
        PathologieFrequente3,
        PathologieFrequente4,
        PathologieFrequente5,
      } = data;

      // Création d'une nouvelle performance avec les tranches d'âge
      const newPerformance = new ummcperformance({
        date,
        region,
        province,
        unite,
        totalPriseEnCharge,
        effectifTotalOperationnel,
        totalUMMCInstallees,
        ConsultationMedcineGenerale,
        Referencement,
        Evacuation,
        ageGroup0to6,
        ageGroup7to14,
        ageGroup15to24,
        ageGroup25to64,
        ageGroup65to100,
        Consultation,
        soins,
        Vaccination,
        Teleexpertises,
        DepistageDiabete,
        DepistageHTA,
        DepistageCancerDuSein,
        DepistageDuCancerDuCol,
        TestCovid19Positif,
        TestCovid19Negatif,
        CasDeRougeole,
        Oreillon,
        SuiviDeGrossesse,
        GrossesseARisque,
        Femme,
        Homme,
        Transfert,
        Urgence,
        PathologieFrequente1,
        PathologieFrequente2,
        PathologieFrequente3,
        PathologieFrequente4,
        PathologieFrequente5,
      });

      // Sauvegarder la nouvelle entrée dans la base de données
      await newPerformance.save();
      return res.status(201).json({ message: "Données ajoutées avec succès" });
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout des données :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const getAllConsultation = async (req, res) => {
  try {
    // Récupérer les paramètres de requête
    const { region, province, unite } = req.query;

    // Construire l'objet de filtrage dynamique
    const filter = {};
    if (region) filter.region = region;
    if (province) filter.province = province;
    if (unite) filter.unite = unite;

    // Récupérer les données de consultation filtrées
    const consultations = await ummcperformance.find(
      filter, // Appliquer le filtre ici
      { date: 1, Consultation: 1, totalPriseEnCharge: 1, _id: 0 }
    );

    // Filtrer les données pour le mois actuel et le mois précédent
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentMonthData = consultations.filter((item) => {
      const itemDate = new Date(item.date);
      return (
        itemDate.getMonth() === currentMonth &&
        itemDate.getFullYear() === currentYear
      );
    });

    const previousMonthData = consultations.filter((item) => {
      const itemDate = new Date(item.date);
      return (
        itemDate.getMonth() === previousMonth &&
        itemDate.getFullYear() === previousYear
      );
    });

    // Calculer le total des consultations pour chaque mois
    const totalCurrentMonthConsultation = currentMonthData.reduce(
      (acc, item) => acc + (item.Consultation || 0),
      0
    );
    const totalPreviousMonthConsultation = previousMonthData.reduce(
      (acc, item) => acc + (item.Consultation || 0),
      0
    );

    // Calculer le total des prises en charge pour chaque mois
    const totalCurrentMonthPriseEnCharge = currentMonthData.reduce(
      (acc, item) => acc + (item.totalPriseEnCharge || 0),
      0
    );
    const totalPreviousMonthPriseEnCharge = previousMonthData.reduce(
      (acc, item) => acc + (item.totalPriseEnCharge || 0),
      0
    );

    // Renvoyer les données filtrées
    res.status(200).json({
      currentMonth: {
        data: currentMonthData,
        totalConsultation: totalCurrentMonthConsultation,
        totalPriseEnCharge: totalCurrentMonthPriseEnCharge,
      },
      previousMonth: {
        data: previousMonthData,
        totalConsultation: totalPreviousMonthConsultation,
        totalPriseEnCharge: totalPreviousMonthPriseEnCharge,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des consultations :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const getAllTeleexpertises = async (req, res) => {
  try {
    // Récupérer les paramètres de requête
    const { region, province, unite } = req.query;

    // Construire l'objet de filtrage dynamique
    const filter = {};
    if (region) filter.region = region;
    if (province) filter.province = province;
    if (unite) filter.unite = unite;

    // Récupérer les données de téléexpertises filtrées
    const teleexpertisesData = await ummcperformance.find(
      filter, // Appliquer le filtre ici
      { date: 1, Teleexpertises: 1, _id: 0 }
    );

    // Filtrer les données pour le mois actuel et le mois précédent
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentMonthData = teleexpertisesData.filter((item) => {
      const itemDate = new Date(item.date);
      return (
        itemDate.getMonth() === currentMonth &&
        itemDate.getFullYear() === currentYear
      );
    });

    const previousMonthData = teleexpertisesData.filter((item) => {
      const itemDate = new Date(item.date);
      return (
        itemDate.getMonth() === previousMonth &&
        itemDate.getFullYear() === previousYear
      );
    });

    // Calculer le total des téléexpertises pour chaque mois
    const totalCurrentMonthTeleexpertises = currentMonthData.reduce(
      (acc, item) => acc + (item.Teleexpertises || 0),
      0
    );
    const totalPreviousMonthTeleexpertises = previousMonthData.reduce(
      (acc, item) => acc + (item.Teleexpertises || 0),
      0
    );

    // Renvoyer les données filtrées et les totaux
    res.status(200).json({
      currentMonth: {
        data: currentMonthData,
        totalTeleexpertises: totalCurrentMonthTeleexpertises,
      },
      previousMonth: {
        data: previousMonthData,
        totalTeleexpertises: totalPreviousMonthTeleexpertises,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des téléexpertises :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
export const getAgeRanges = async (req, res) => {
  try {
    // Récupérer les paramètres de requête
    const { region, province, unite, dateDebut, dateFin } = req.query;

    // Construire le filtre de base
    const filter = {};
    if (region) filter.region = region;
    if (province) filter.province = province;
    if (unite) filter.unite = unite;

    // Récupérer toutes les données sans filtrer par date (car les dates sont des strings)
    const data = await ummcperformance.find(filter);

    // Convertir les dates en objets Date et filtrer manuellement
    let filteredData = data.map((entry) => ({
      ...entry._doc, // Utiliser ._doc pour accéder aux données brutes de Mongoose
      date: new Date(entry.date), // Convertir la date en objet Date
    }));

    // Appliquer le filtre de date manuellement
    if (dateDebut) {
      filteredData = filteredData.filter(
        (entry) => entry.date >= new Date(dateDebut)
      );
    }
    if (dateFin) {
      filteredData = filteredData.filter(
        (entry) => entry.date <= new Date(dateFin)
      );
    }

    // Initialiser les variables pour les calculs des tranches d'âge
    const ageRanges = {
      "0-6": 0,
      "7-14": 0,
      "15-24": 0,
      "25-64": 0,
      "65-100": 0,
    };

    // Parcourir les données filtrées pour effectuer les calculs des tranches d'âge
    filteredData.forEach((entry) => {
      ageRanges["0-6"] += entry.ageGroup0to6 || 0;
      ageRanges["7-14"] += entry.ageGroup7to14 || 0;
      ageRanges["15-24"] += entry.ageGroup15to24 || 0;
      ageRanges["25-64"] += entry.ageGroup25to64 || 0;
      ageRanges["65-100"] += entry.ageGroup65to100 || 0;
    });

    // Calculer le total des prises en charge
    const totalPriseEnCharge = Object.values(ageRanges).reduce(
      (sum, count) => sum + count,
      0
    );

    // Calculer les taux par tranche d'âge
    const ageRates = totalPriseEnCharge
      ? {
          "0-6": ((ageRanges["0-6"] / totalPriseEnCharge) * 100).toFixed(2),
          "7-14": ((ageRanges["7-14"] / totalPriseEnCharge) * 100).toFixed(2),
          "15-24": ((ageRanges["15-24"] / totalPriseEnCharge) * 100).toFixed(2),
          "25-64": ((ageRanges["25-64"] / totalPriseEnCharge) * 100).toFixed(2),
          "65-100": ((ageRanges["65-100"] / totalPriseEnCharge) * 100).toFixed(
            2
          ),
        }
      : {
          "0-6": "0.00",
          "7-14": "0.00",
          "15-24": "0.00",
          "25-64": "0.00",
          "65-100": "0.00",
        };

    // Renvoyer la réponse avec les tranches d'âge et leurs taux
    res.status(200).json({
      totalPriseEnCharge,
      ageRanges,
      ageRates,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des tranches d'âge :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
