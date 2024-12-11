import TicketVehicule from "../models/ticketVehiculeModel.js";

// Get all ticketvehicules
export const getAllTicketVehicules = async (req, res) => {
  try {
    // Extraire la valeur du paramètre 'isClosed' depuis les query parameters
    const { isClosed } = req.query;

    // Construire un objet de filtre dynamique
    const filter = {};
    if (isClosed !== undefined) {
      filter.isClosed = isClosed === "true"; // Convertir le string en booléen
    }

    // Récupérer les tickets en fonction du filtre
    const ticketVehicules = await TicketVehicule.find(filter);
    res.status(200).json(ticketVehicules);
  } catch (error) {
    res.status(500).json({ message: "Error fetching ticketvehicules", error });
  }
};

// Get a single ticketvehicule by ID
export const getTicketVehiculeById = async (req, res) => {
  try {
    const ticketVehicule = await TicketVehicule.findById(req.params.id);
    if (!ticketVehicule) {
      return res.status(404).json({ message: "TicketVehicule not found" });
    }
    res.status(200).json(ticketVehicule);
  } catch (error) {
    res.status(500).json({ message: "Error fetching ticketvehicule", error });
  }
};

// Create a new ticketvehicule
export const createTicketVehicule = async (req, res) => {
  try {
    // Create a new ticketVehicule object with the request body data
    const newTicketVehicule = new TicketVehicule({
      ...req.body,
    });

    // Save the new ticket to the database
    const savedTicketVehicule = await newTicketVehicule.save();

    // Return the saved ticket with a 201 status code
    res.status(201).json(savedTicketVehicule);
  } catch (error) {
    // Return error message if ticket creation fails
    res.status(400).json({ message: "Error creating ticketvehicule", error });
  }
};

// Update a ticketvehicule by ID
export const updateTicketVehicule = async (req, res) => {
  try {
    const updatedTicketVehicule = await TicketVehicule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedTicketVehicule) {
      return res.status(404).json({ message: "TicketVehicule not found" });
    }
    res.status(200).json(updatedTicketVehicule);
  } catch (error) {
    res.status(400).json({ message: "Error updating ticketvehicule", error });
  }
};

// Delete a ticketvehicule by ID
export const deleteTicketVehicule = async (req, res) => {
  try {
    const deletedTicketVehicule = await TicketVehicule.findByIdAndDelete(
      req.params.id
    );
    if (!deletedTicketVehicule) {
      return res.status(404).json({ message: "TicketVehicule not found" });
    }
    res.status(200).json({ message: "TicketVehicule deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting ticketvehicule", error });
  }
};
