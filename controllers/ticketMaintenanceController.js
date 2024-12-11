import TicketMaintenance from "../models/ticketMaintenancemodel.js";

// Get all tickets
export const getAllTickets = async (req, res) => {
  try {
    // Vérifie si le filtre "isClosed" est présent dans la requête
    const { isClosed } = req.query;

    // Crée une condition de filtre si "isClosed" est fourni
    const filter = {};
    if (isClosed !== undefined) {
      filter.isClosed = isClosed === "true"; // Convertit "true"/"false" en boolean
    }

    // Récupère les tickets en fonction du filtre
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
  } = req.body;

  try {
    // Créez un nouveau ticket avec les nouveaux champs
    const newTicket = new TicketMaintenance({
      name,
      site,
      province,
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
    technicien,
    equipement_deficitaire,
    categorie,
    description,
    urgence,
    isClosed,
    dateCloture,
    commentaire,
  } = req.body;

  try {
    // Mise à jour du ticket avec tous les champs passés dans la requête
    const updatedTicket = await TicketMaintenance.findByIdAndUpdate(
      req.params.id,
      {
        name,
        site,
        province,
        technicien,
        equipement_deficitaire,
        categorie,
        description,
        urgence,
        isClosed,
        dateCloture,
        commentaire,
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
