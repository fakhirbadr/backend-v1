import TicketMaintenance from "../models/ticketMaintenancemodel.js";
import Fourniture from "../models/ticketFournitureModel.js";

export const getMergedData = async (req, res) => {
  const {
    isClosed,
    status,
    isDeleted,
    region,
    province,
    startDate,
    endDate,
    categorie,
    description,
  } = req.query;

  try {
    // 1. Récupération des données brutes
    const fournitures = await Fourniture.find();
    const ticketsMaintenance = await TicketMaintenance.find({
      subTickets: { $exists: true, $not: { $size: 0 } },
    }).populate("subTickets");

    // 2. Harmonisation des données
    const harmonizedFournitures = fournitures.map((fourniture) => ({
      id: fourniture._id,
      name: fourniture.name,
      categorie: fourniture.categorie,
      description: fourniture.besoin,
      status: fourniture.status,
      isClosed: fourniture.isClosed,
      province: fourniture.province,
      region: fourniture.region,
      dateCloture: fourniture.dateCloture,
      tempsDeResolutionDetaille: fourniture.tempsDeResolutionDetaille,
      commentaire: fourniture.commentaire,
      createdAt: fourniture.dateCreation,
      isDeleted: fourniture.isDeleted,
      updatedAt: fourniture.dateCloture || null,
      type: "Fourniture",
    }));

    const harmonizedSubTickets = ticketsMaintenance.flatMap((ticket) =>
      ticket.subTickets.map((subTicket) => ({
        id: subTicket._id,
        name: subTicket.name,
        categorie: ticket.categorie,
        description: subTicket.equipement_deficitaire,
        status: subTicket.status,
        isClosed: subTicket.isClosed,
        province: subTicket.province,
        region: subTicket.region,
        tempsDeResolutionDetaille: ticket.tempsDeResolutionDetaille,
        commentaire: subTicket.commentaire,
        createdAt: subTicket.createdAt,
        updatedAt: subTicket.updatedAt,
        parentId: ticket._id,
        isDeleted: subTicket.isDeleted || false,
        type: "SubTicket",
      }))
    );

    // 3. Fusion des données
    let mergedData = [...harmonizedFournitures, ...harmonizedSubTickets];

    // 4. Application des filtres
    if (isClosed !== undefined) {
      const filterClosed = isClosed === "true";
      mergedData = mergedData.filter((item) => item.isClosed === filterClosed);
    }

    if (status) {
      mergedData = mergedData.filter((item) => item.status === status);
    }
    if (categorie) {
      mergedData = mergedData.filter((item) => item.categorie === categorie);
    }
    if (description) {
      mergedData = mergedData.filter(
        (item) => item.description === description
      );
    }

    if (isDeleted !== undefined) {
      const filterDeleted = isDeleted === "true";
      mergedData = mergedData.filter((item) =>
        filterDeleted ? item.isDeleted === true : item.isDeleted !== true
      );
    }
    // Filtre par région
    if (region) {
      mergedData = mergedData.filter((item) => item.region === region);
    }
    // Filtre par province
    if (province) {
      mergedData = mergedData.filter((item) => item.province === province);
    }

    // Filtre par plage de dates (createdAt)
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      mergedData = mergedData.filter((item) => {
        const createdAt = new Date(item.createdAt);
        return createdAt >= start && createdAt <= end;
      });
    }
    // 5. Calcul des statistiques
    const countsByType = mergedData.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {});
    countsByType.total = mergedData.length;

    const countsByCategory = mergedData.reduce((acc, item) => {
      const category = item.categorie || "Non catégorisé";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
    countsByCategory.total = mergedData.length;

    const convertToMinutes = (timeStr) => {
      if (!timeStr || timeStr === "Non clôturé") return null;
      const daysMatch = timeStr.match(/(\d+)j/);
      const hoursMatch = timeStr.match(/(\d+)h/);
      const minutesMatch = timeStr.match(/(\d+)m/);
      const days = daysMatch ? parseInt(daysMatch[1]) * 1440 : 0;
      const hours = hoursMatch ? parseInt(hoursMatch[1]) * 60 : 0;
      const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
      return days + hours + minutes;
    };

    let totalClosed = 0;
    let totalOpen = 0;
    let totalResolutionTime = 0;
    let totalAge = 0;

    const closedCountsByCategory = {};
    const totalResolutionTimeByCategory = {};
    const openCountsByCategory = {};
    const totalAgeByCategory = {};

    const now = new Date();

    mergedData.forEach((item) => {
      const category = item.categorie || "Non catégorisé";

      // Calculs globaux
      if (item.isClosed) totalClosed++;
      else totalOpen++;

      // Calculs par catégorie
      if (item.isClosed && item.tempsDeResolutionDetaille !== "Non clôturé") {
        const resolutionTime = convertToMinutes(item.tempsDeResolutionDetaille);
        if (resolutionTime !== null) {
          closedCountsByCategory[category] =
            (closedCountsByCategory[category] || 0) + 1;
          totalResolutionTimeByCategory[category] =
            (totalResolutionTimeByCategory[category] || 0) + resolutionTime;
          totalResolutionTime += resolutionTime;
        }
      }

      if (!item.isClosed) {
        openCountsByCategory[category] =
          (openCountsByCategory[category] || 0) + 1;
        const createdAt = new Date(item.createdAt);
        const ageInMinutes = Math.floor((now - createdAt) / 60000);
        totalAgeByCategory[category] =
          (totalAgeByCategory[category] || 0) + ageInMinutes;
        totalAge += ageInMinutes;
      }
    });

    // Fonction de formatage des durées
    const formatDuration = (minutes) => {
      if (minutes === null || isNaN(minutes)) return "0j 0h 0m";
      const days = Math.floor(minutes / 1440);
      const hours = Math.floor((minutes % 1440) / 60);
      const minutesPart = Math.floor(minutes % 60);
      return `${days}j ${hours}h ${minutesPart}m`;
    };

    // Calcul des moyennes par catégorie
    const avgResolutionTimeByCategory = Object.keys(
      totalResolutionTimeByCategory
    ).reduce((acc, category) => {
      const totalResolved = closedCountsByCategory[category] || 1;
      const avgMinutes =
        totalResolutionTimeByCategory[category] / totalResolved;
      acc[category] = formatDuration(avgMinutes);
      return acc;
    }, {});

    const avgAgeByCategory = Object.keys(totalAgeByCategory).reduce(
      (acc, category) => {
        const totalOpen = openCountsByCategory[category] || 1;
        const avgMinutes = totalAgeByCategory[category] / totalOpen;
        acc[category] = formatDuration(avgMinutes);
        return acc;
      },
      {}
    );

    // Taux de satisfaction par catégorie
    const satisfactionRateByCategory = Object.keys(countsByCategory).reduce(
      (acc, category) => {
        const closedCount = closedCountsByCategory[category] || 0;
        const totalCount = countsByCategory[category] || 1;
        acc[category] = ((closedCount / totalCount) * 100).toFixed(2) + "%";
        return acc;
      },
      {}
    );

    // Statistiques globales
    const globalStats = {
      totalTickets: mergedData.length,
      totalClosed,
      totalOpen,
      avgResolutionTime:
        totalClosed > 0
          ? formatDuration(totalResolutionTime / totalClosed)
          : "0j 0h 0m",
      avgOpenAge:
        totalOpen > 0 ? formatDuration(totalAge / totalOpen) : "0j 0h 0m",
      satisfactionRate:
        ((totalClosed / mergedData.length) * 100 || 0).toFixed(2) + "%",
    };

    const totalTickets = mergedData.length;
    const categoryAnalysis = Object.keys(countsByCategory).reduce(
      (acc, category) => {
        if (category !== "total") {
          // Exclure la clé "total" du calcul
          const count = countsByCategory[category];
          const rate = ((count / totalTickets) * 100).toFixed(2) + "%";
          acc[category] = {
            // count,
            rate,
          };
        }
        return acc;
      },
      {}
    );

    // 6. Envoi de la réponse
    res.status(200).json({
      mergedData,
      total: mergedData.length,
      countsByType,
      countsByCategory,
      closedCountsByCategory,
      satisfactionRateByCategory,
      avgResolutionTimeByCategory,
      openCountsByCategory,
      avgAgeByCategory,
      globalStats,
      categoryAnalysis,
    });
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({
      message: "Erreur serveur lors de la récupération des données",
      error: error.message,
    });
  }
};
