import TicketMaintenance from "../models/ticketMaintenancemodel.js";
import moment from "moment";

// Get all tickets
export const getAllTickets = async (req, res) => {
  try {
    // Vérifie les filtres présents dans la requête
    const {
      isClosed,
      currentMonth,
      site,
      region,
      isDeleted,
      technicien,
      startDate,
      endDate,
      province, // Ajout du paramètre province
      dateClotureStart, // Date de début pour le filtre par date de clôture
      dateClotureEnd, // Date de fin pour le filtre par date de clôture
      isVisible, // Ajout du paramètre isVisible
    } = req.query;

    // Crée une condition de filtre
    const filter = {};

    // Ajoute un filtre pour "isClosed" si présent
    if (isClosed !== undefined) {
      filter.isClosed = isClosed === "true"; // Convertit "true"/"false" en boolean
    }

    // Ajoute un filtre pour le mois actuel si "currentMonth" est présent
    if (currentMonth === "true") {
      const startOfMonth = moment().startOf("month").toDate(); // Début du mois
      const endOfMonth = moment().endOf("month").toDate(); // Fin du mois

      filter.createdAt = { $gte: startOfMonth, $lte: endOfMonth };
    }

    // Ajoute un filtre pour "site" si présent
    if (site) {
      const sites = site.split(","); // Si plusieurs sites sont passés, on les sépare par des virgules
      filter.site = { $in: sites }; // Utilise $in pour rechercher dans une liste
    }

    // Ajoute un filtre pour "region" si présent
    if (region) {
      const regions = region.split(","); // Gère plusieurs régions passées dans la requête
      filter.region = { $in: regions }; // Utilise $in pour rechercher dans une liste
    }

    // Ajoute un filtre pour "province" si présent
    if (province) {
      const provinces = province.split(","); // Gère plusieurs provinces passées dans la requête
      filter.province = { $in: provinces }; // Utilise $in pour rechercher dans une liste
    }

    // Ajoute un filtre pour "technicien" si présent
    if (technicien) {
      const techniciensArray = technicien.split(","); // Utilisez un autre nom pour la variable intermédiaire
      filter.technicien = { $in: techniciensArray }; // Utilise $in pour rechercher dans une liste
    }

    // Ajoute un filtre pour "isDeleted" si présent
    if (isDeleted !== undefined) {
      filter.isDeleted = isDeleted === "false"; // Convertit "true"/"false" en boolean
    }

    // Ajoute un filtre pour les dates si "startDate" et "endDate" sont présents
    if (startDate && endDate) {
      // Utilise moment.js pour convertir les dates en objets Date
      filter.createdAt = {
        $gte: moment(startDate).toDate(),
        $lte: moment(endDate).toDate(),
      };
    }

    // Ajoute un filtre pour la "dateCloture" si des plages de dates sont spécifiées
    if (dateClotureStart && dateClotureEnd) {
      filter.dateCloture = {
        $gte: moment(dateClotureStart).toDate(),
        $lte: moment(dateClotureEnd).toDate(),
      };
    }

    // Ajoute un filtre pour la visibilité si "isVisible" est présent
    if (isVisible !== undefined) {
      filter.isVisible = isVisible === "true"; // Convertit "true"/"false" en boolean
    }

    // Récupère les tickets en fonction des filtres
    const tickets = await TicketMaintenance.find(filter);

    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get ticket by ID
export const getTicketById = async (req, res) => {
  try {
    const ticket = await TicketMaintenance.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new ticket
export const createTicket = async (req, res) => {
  const {
    name,
    site,
    province,
    region,
    technicien,
    equipement_deficitaire,
    categorie,
    description,
    urgence,
    isClosed,
    dateCloture,
    commentaire,
    selectedActifId,
    selectedCategoryId,
    selectedEquipmentId,
    cloturerPar,
    isDeleted,
    subTickets = [],
  } = req.body;

  try {
    // Créez un nouveau ticket avec les nouveaux champs
    const newTicket = new TicketMaintenance({
      name,
      site,
      province,
      region,
      technicien,
      categorie,
      description,
      equipement_deficitaire, // Ajout du champ "equipement_deficitaire"
      urgence, // Ajout du champ "urgence"
      isClosed,
      dateCloture,
      commentaire,
      selectedActifId,
      selectedCategoryId,
      selectedEquipmentId,
      cloturerPar,
      isDeleted,
      subTickets,
    });

    await newTicket.save();
    res.status(201).json(newTicket);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a ticket by ID
export const updateTicket = async (req, res) => {
  const {
    name,
    site,
    province,
    region,
    technicien,
    equipement_deficitaire,
    categorie,
    description,
    urgence,
    isClosed,
    dateCloture,
    commentaire,
    cloturerPar,
    isDeleted,
    deletedBy,
    isVisible,
    subTickets = [], // Les sous-tickets doivent être envoyés séparément pour être correctement gérés
  } = req.body;

  try {
    // Recherche le ticket par son ID
    const ticket = await TicketMaintenance.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Conserve les sous-tickets existants si les nouveaux sous-tickets ne sont pas passés dans la requête
    ticket.subTickets = subTickets.length ? subTickets : ticket.subTickets;

    // Mise à jour du ticket principal
    const updatedTicket = await TicketMaintenance.findByIdAndUpdate(
      req.params.id,
      {
        name,
        site,
        province,
        region,
        technicien,
        equipement_deficitaire,
        categorie,
        description,
        urgence,
        isClosed,
        dateCloture,
        commentaire,
        cloturerPar,
        isDeleted,
        deletedBy,
        isVisible,
        subTickets: ticket.subTickets, // Garde les sous-tickets existants
      },
      { new: true }
    );

    if (!updatedTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json(updatedTicket);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a ticket by ID
export const deleteTicket = async (req, res) => {
  try {
    const deletedTicket = await TicketMaintenance.findByIdAndDelete(
      req.params.id
    );

    if (!deletedTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a sub-ticket by ID
export const deleteSubTicket = async (req, res) => {
  const { ticketId, subTicketId } = req.params;

  try {
    // Rechercher le ticket principal et supprimer le sous-ticket correspondant
    const updatedTicket = await TicketMaintenance.findByIdAndUpdate(
      ticketId,
      { $pull: { subTickets: { _id: subTicketId } } }, // Utilisation de `$pull` pour retirer le sous-ticket par son ID
      { new: true } // Retourner le ticket mis à jour
    );

    if (!updatedTicket) {
      return res
        .status(404)
        .json({ message: "Ticket or sub-ticket not found" });
    }

    res.status(200).json({
      message: "Sub-ticket deleted successfully",
      ticket: updatedTicket,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get equipment categories with percentages
export const getCatégorieEquipment = async (req, res) => {
  try {
    // Récupérer les filtres de la requête
    const { isClosed, region, province, startDate, endDate } = req.query;

    // Créer un objet de filtre pour la requête
    const filter = {};

    // Ajouter un filtre pour "isClosed" si présent
    if (isClosed !== undefined) {
      filter.isClosed = isClosed === "true"; // Convertit "true"/"false" en boolean
    }

    // Ajouter un filtre pour "region" si présent
    if (region) {
      const regions = region.split(","); // Gère plusieurs régions passées dans la requête
      filter.region = { $in: regions }; // Utilise $in pour rechercher dans une liste
    }

    // Ajouter un filtre pour "province" si présent
    if (province) {
      const provinces = province.split(","); // Gère plusieurs provinces passées dans la requête
      filter.province = { $in: provinces }; // Utilise $in pour rechercher dans une liste
    }

    // Ajouter un filtre pour les dates si "startDate" et "endDate" sont présents
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate), // Date de début
        $lte: new Date(endDate), // Date de fin
      };
    }

    // Récupérer les tickets en fonction des filtres
    const tickets = await TicketMaintenance.find(filter);

    // Si aucun ticket n'est trouvé, retourner un message
    if (tickets.length === 0) {
      return res
        .status(200)
        .json({ message: "No tickets found with the given filters." });
    }

    // Initialiser un objet pour stocker le nombre de tickets par catégorie
    const categoryCounts = {};

    // Compter le nombre de tickets pour chaque catégorie
    tickets.forEach((ticket) => {
      if (ticket.categorie) {
        if (categoryCounts[ticket.categorie]) {
          categoryCounts[ticket.categorie]++;
        } else {
          categoryCounts[ticket.categorie] = 1;
        }
      }
    });

    // Calculer le pourcentage pour chaque catégorie
    const totalTickets = tickets.length;
    const categoryPercentages = {};

    for (const category in categoryCounts) {
      const percentage = (categoryCounts[category] / totalTickets) * 100;
      categoryPercentages[category] = percentage.toFixed(1) + "%"; // Arrondir à une décimale
    }

    // Retourner les résultats
    res.status(200).json(categoryPercentages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
