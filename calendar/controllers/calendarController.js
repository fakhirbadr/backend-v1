import Calendar from "../models/calendarModels.js";

export const getCalendar = async (req, res) => {
  try {
    const calendar = await Calendar.find();
    res.status(200).json({
      status: "success",
      resultat: calendar.length,
      data: {
        calendar,
      },
    });
  } catch (err) {
    console.log("erreur lors de la récupuration de la data de l'api");
    res.status(500).json({
      status: "fail",
      message: "erreur lors de la recup",
    });
  }
};

export const createCalendar = async (req, res) => {
  try {
    const newCalendar = await Calendar.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        calendar: newCalendar,
      },
    });
  } catch (err) {
    console.error("erreur lors de la création", err.message);
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

export const updateCalendar = async (req, res) => {
  try {
    const updatedCalendar = await Calendar.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedCalendar) {
      return res.status(404).json({
        status: "fail",
        message: "calender not faoun",
      });
    }
    res.status(200).json({
      status: " success",
      data: {
        calendar: updateCalendar,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

export const deleteCalendar = async (req, res) => {
  try {
    const deletedCalendar = await Calendar.findByIdAndDelete(req.params.id);
    if (!deletedCalendar) {
      return res.status(404).json({
        status: "fail",
      });
    }
    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
