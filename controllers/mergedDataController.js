import TicketMaintenance from "../models/ticketMaintenancemodel.js";
import Fourniture from "../models/ticketFournitureModel.js";

export const getMergedData = async (req, res) => {
  const { isClosed, status, isDeleted } = req.query; // Ajouter le filtre isDeleted aux paramètres de requête

  try {
    // Filtre pour les fournitures
    const fournituresFilter = {};
    if (isClosed !== undefined) {
      fournituresFilter.isClosed = isClosed === "true"; // Convertir en booléen
    }
    if (status) {
      fournituresFilter.status = status;
    }
    if (isDeleted !== undefined) {
      fournituresFilter.isDeleted = isDeleted === "true"; // Convertir en booléen
    }

    // 1. Récupérer les données des deux collections
    const fournitures = await Fourniture.find(fournituresFilter);
    const ticketsMaintenance = await TicketMaintenance.find({
      subTickets: { $exists: true, $not: { $size: 0 } }, // Filtrer les tickets avec des sous-tickets
    }).populate("subTickets");

    // 2. Harmoniser les données
    const harmonizedFournitures = fournitures.map((fourniture) => ({
      id: fourniture._id,
      name: fourniture.name,
      categorie: fourniture.categorie,
      description: fourniture.besoin,
      status: fourniture.status,
      isClosed: fourniture.isClosed,
      province: fourniture.province,
      region: fourniture.region,
      commentaire: fourniture.commentaire,
      createdAt: fourniture.dateCreation,
      isDeleted: fourniture.isDeleted,
      updatedAt: fournitures.dateCloture || null,
      type: "Fourniture", // Indiquer la source des données
    }));

    const harmonizedSubTickets = ticketsMaintenance.flatMap((ticket) =>
      ticket.subTickets.map((subTicket) => ({
        id: subTicket._id,
        name: subTicket.name,
        categorie: subTicket.categorie,
        description: subTicket.equipement_deficitaire,
        status: subTicket.status,
        isClosed: subTicket.isClosed,
        province: subTicket.province,
        region: subTicket.region,
        commentaire: subTicket.commentaire,
        createdAt: subTicket.createdAt,
        updatedAt: subTicket.updatedAt,
        parentId: ticket._id, // Ajouter l'ID du parent
        type: "SubTicket", // Indiquer la source des données
      }))
    );

    // 3. Fusionner les données
    const mergedData = [...harmonizedFournitures, ...harmonizedSubTickets];

    // Appliquer le filtre isDeleted aux données fusionnées
    const filteredData =
      isDeleted === "false"
        ? mergedData.filter(
            (data) => data.isDeleted === false || data.isDeleted === undefined // Inclure les données sans isDeleted
          )
        : mergedData;

    // 4. Retourner les données fusionnées
    res.status(200).json({
      mergedData: filteredData,
      total: filteredData.length, // Retourner le nombre total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de la récupération des données",
      error: error.message,
    });
  }
};
