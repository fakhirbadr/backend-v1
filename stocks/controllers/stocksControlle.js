import Stocks from "../models/stocksModel.js";

export const getAllStocks = async (req, res) => {
  try {
    const stocks = await Stocks.find();
    res.status(200).json({
      status: "success",
      resultat: stocks.length,
      data: {
        stocks,
      },
    });
  } catch (err) {
    console.log("Erreur lors de la récupuration de data de l'api stocks", err);
    res.status(500).json({
      status: "fail",
      message: "Erreur lors de la récupuration de data de l'api stocks",
    });
  }
};
// get stocks by id
export const getStocks = async (req, res) => {
  try {
    const stock = Stocks.findById(req.params.id);
    if (!stock) {
      return res.status(404).json({
        status: "fail",
        message: "stocks not faound",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        stock,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

export const createStocks = async (req, res) => {
  try {
    const newStocks = await Stocks.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        stock: newStocks,
      },
    });
  } catch (err) {
    console.error("Erreur lors de la création :", err.message);
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

export const updateStock = async (req, res) => {
  try {
    const updateStock = await Stocks.findByIdAndUpdate(
      req.params.id,
      req.body, // Ajout de la virgule ici
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updateStock) {
      return res.status(404).json({
        status: "fail",
        message: "Stock not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        stock: updateStock,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

export const deleteStocks = async (req, res) => {
  try {
  } catch {}
};
