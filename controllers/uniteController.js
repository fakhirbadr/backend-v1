// controllers/uniteController.js
import Unite from "../models/unitesModel.js";
// find all unites
export const getAllUnite = async (req, res) => {
  try {
    // 1) Construire la requête
    // Créer une copie de l'objet de requête pour le filtrage
    let queryObj = { ...req.query };

    // Définir les champs à exclure de la requête
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]); // Supprimer les champs exclus de l'objet de requête

    // 2) Filtrage avancé
    // Convertir l'objet de requête en chaîne JSON pour le traitement
    let queryStr = JSON.stringify(queryObj);

    // Remplacer les opérateurs de comparaison par leurs équivalents MongoDB
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // Vérifier la chaîne de requête modifiée dans la console pour le débogage
    console.log(JSON.parse(queryStr));

    // Convertir la chaîne de requête modifiée en objet
    queryObj = JSON.parse(queryStr);

    // 3) Convertir les valeurs numériques en nombres
    Object.keys(queryObj).forEach((key) => {
      // Vérifier si la clé est lat, long ou un autre champ à convertir
      if (typeof queryObj[key] === "string" && !isNaN(queryObj[key])) {
        queryObj[key] = parseFloat(queryObj[key]); // Convertir en nombre
      }
    });

    // Construire la requête Mongoose à partir de l'objet de requête
    let query = Unite.find(queryObj); // Changez 'const' en 'let'

    // 4) Limitation des champs
    if (req.query.fields) {
      // Utilisez split pour obtenir un tableau de champs et join pour les séparer par des espaces
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    //5) pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const numUnite = await unites.countDocuments();
      if (skip > numUnite) throw new Error("cette page n'éxiste pas");
    }

    // Exécuter la requête et attendre les résultats
    const unites = await query;

    // Retourner la réponse avec les résultats
    res.status(200).json({
      status: "success",
      results: unites.length,
      data: {
        unites,
      },
    });
  } catch (err) {
    // Gérer les erreurs et retourner une réponse d'échec
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

export const getUnite = async (req, res) => {
  try {
    const unite = await Unite.findById(req.params.id);
    if (!unite) {
      return res.status(404).json({
        status: "fail",
        message: "Unite not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        unite,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
// create
export const createUnite = async (req, res) => {
  try {
    const newUnite = await Unite.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        unite: newUnite,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

export const updateUnite = async (req, res) => {
  try {
    const updatedUnite = await Unite.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUnite) {
      return res.status(404).json({
        status: "fail",
        message: "Unite not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        unite: updatedUnite,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

export const deleteUnite = async (req, res) => {
  try {
    const deletedUnite = await Unite.findByIdAndDelete(req.params.id);
    if (!deletedUnite) {
      return res.status(404).json({
        status: "fail",
        message: "Unite not found",
      });
    }

    res.status(204).json({
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
