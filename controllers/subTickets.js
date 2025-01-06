import TicketMaintenance from "../models/ticketMaintenancemodel.js";

// Récupérer uniquement les sous-tickets de maintenance
// Récupérer uniquement les sous-tickets de maintenance avec l'ID du parent
export const getSubTicketsForMaintenance = async (req, res) => {
  const { isClosed, status } = req.query; // Récupérer les filtres isClosed et status si présents

  try {
    // Préparer le filtre pour isClosed si un filtre est passé
    const filter = {};

    if (isClosed !== undefined) {
      filter["subTickets.isClosed"] = isClosed === "true"; // Convertir en booléen
    }

    // Filtre par status si fourni
    if (status) {
      if (status.startsWith("!")) {
        // Exclure un ou plusieurs statuts
        const excludedStatuses = status.substring(1).split(",");
        filter["subTickets.status"] = { $nin: excludedStatuses };
      } else {
        // Inclure uniquement le statut spécifié
        filter["subTickets.status"] = status;
      }
    }

    // Récupérer les tickets de maintenance avec sous-tickets
    const ticketsMaintenance = await TicketMaintenance.find({
      subTickets: { $exists: true, $not: { $size: 0 } }, // Filtrer les tickets avec des sous-tickets
      ...filter, // Ajouter le filtre isClosed et status si présents
    }).populate("subTickets"); // Peupler les sous-tickets

    // Extraire uniquement les sous-tickets et ajouter l'ID du parent
    const subTickets = ticketsMaintenance.flatMap((ticket) =>
      ticket.subTickets.map((subTicket) => ({
        ...subTicket.toObject(), // Convertir en objet JavaScript si nécessaire
        parentId: ticket._id, // Ajouter l'ID du parent
      }))
    );

    // Compter le nombre total de sous-tickets
    const totalSubTickets = subTickets.length;

    // Renvoyer les sous-tickets avec le total
    res.json({
      subTickets,
      totalSubTickets,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const updateSubTicket = async (req, res) => {
  const { subTicketId } = req.params; // ID du sous-ticket
  const updates = req.body; // Contenu à mettre à jour

  try {
    // Trouver le sous-ticket à mettre à jour dans les sous-tickets des tickets de maintenance
    const ticket = await TicketMaintenance.findOne({
      "subTickets._id": subTicketId,
    });

    if (!ticket) {
      return res.status(404).json({ message: "Sous-ticket introuvable" });
    }

    // Mettre à jour le sous-ticket spécifique
    const subTicket = ticket.subTickets.id(subTicketId);
    if (!subTicket) {
      return res.status(404).json({ message: "Sous-ticket introuvable" });
    }

    // Appliquer les mises à jour
    Object.keys(updates).forEach((key) => {
      subTicket[key] = updates[key];
    });

    // Sauvegarder les modifications
    await ticket.save();

    res.json({ message: "Sous-ticket mis à jour avec succès", subTicket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
