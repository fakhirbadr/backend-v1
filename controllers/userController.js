import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // Ajout de bcryptjs pour hacher et vérifier les mots de passe
import Actif from "../models/actifModel.js"; // Assurez-vous que le modèle Actif est importé

// Fonction pour générer un token JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Contrôleur pour enregistrer un utilisateur

export const registerUser = async (req, res) => {
  const {
    email,
    password,
    role,
    province,
    site,
    nomComplet,
    actifIds, // Liste des IDs d'actifs
  } = req.body;

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "L'utilisateur existe déjà." });
    }

    // Gestion des actifs
    if (actifIds && Array.isArray(actifIds)) {
      const actifs = await Actif.find({ _id: { $in: actifIds } });
      if (actifs.length !== actifIds.length) {
        return res.status(400).json({
          message: "Certains des actifs fournis sont introuvables.",
        });
      }
    }

    // Hacher le mot de passe avant de le sauvegarder
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer un nouvel utilisateur
    const newUser = await User.create({
      email,
      password: hashedPassword, // Sauvegarder le mot de passe haché
      role,
      province,
      site,
      nomComplet,
      actifIds, // Enregistrer directement les IDs des actifs
    });

    // Réponse de succès
    res.status(201).json({
      message: "Utilisateur créé avec succès.",
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        province: newUser.province,
        site: newUser.site,
        nomComplet: newUser.nomComplet,
        actifIds: newUser.actifIds, // Retourner la liste des IDs
      },
      token: generateToken(newUser._id, newUser.role), // Générer un token
    });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur.", error });
  }
};

// Contrôleur pour connecter un utilisateur
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    console.log("User found:", user.email);
    console.log("Password from request:", password); // Afficher le mot de passe en clair

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(password, user.password);
    console.log("Password comparison result:", isPasswordValid); // Afficher le résultat de la comparaison

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Mot de passe incorrect." });
    }

    // Générer un token JWT
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      message: "Connexion réussie.",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        province: user.province,
        site: user.site,
        nomComplet: user.nomComplet,
        actifIds: user.actifIds, // Utilisez l'ID enregistré dans le document User
        // Utilisez l'ID enregistré dans le document User
      },
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Erreur serveur.", error });
  }
};

// Contrôleur pour récupérer les informations de l'utilisateur connecté
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur.", error });
  }
};

// Contrôleur pour mettre à jour les informations d'un utilisateur
export const updateUser = async (req, res) => {
  const { id } = req.params; // ID de l'utilisateur à mettre à jour
  const {
    email,
    password,
    role,
    province,
    site,
    nomComplet,
    actifIds, // Tableau contenant les IDs des actifs
  } = req.body;

  try {
    // Vérifier si l'utilisateur existe
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    // Gestion des actifs
    if (actifIds && Array.isArray(actifIds)) {
      // Vérifie si tous les actifs existent
      const actifs = await Actif.find({ _id: { $in: actifIds } });
      if (actifs.length !== actifIds.length) {
        return res.status(400).json({
          message: "Certains des actifs fournis sont introuvables.",
        });
      }
      user.actifIds = actifIds; // Remplace l'ensemble des actifs
    }

    // Mettre à jour les autres champs si fournis
    if (email) user.email = email;
    if (password) {
      // Hacher le mot de passe s'il est fourni
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    if (role) user.role = role;
    if (province) user.province = province;
    if (site) user.site = site;
    if (nomComplet) user.nomComplet = nomComplet;

    // Sauvegarder les modifications
    const updatedUser = await user.save();

    res.status(200).json({
      message: "Utilisateur mis à jour avec succès.",
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        role: updatedUser.role,
        province: updatedUser.province,
        site: updatedUser.site,
        nomComplet: updatedUser.nomComplet,
        actifIds: updatedUser.actifIds,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
    res.status(500).json({ message: "Erreur serveur.", error });
  }
};

// Contrôleur pour récupérer tous les utilisateurs
export const getAllUsers = async (req, res) => {
  try {
    // Récupérer tous les utilisateurs sans leur mot de passe
    const users = await User.find().select("-password");

    if (users.length === 0) {
      return res.status(404).json({ message: "Aucun utilisateur trouvé." });
    }

    res.status(200).json({ users });
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
    res.status(500).json({ message: "Erreur serveur.", error });
  }
};

// Contrôleur pour supprimer un utilisateur

// Contrôleur pour supprimer un utilisateur
export const deleteUser = async (req, res) => {
  const { id } = req.params; // Récupérer l'ID de l'utilisateur à supprimer

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    // Supprimer l'utilisateur
    await User.findByIdAndDelete(id);

    res.status(200).json({ message: "Utilisateur supprimé avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur :", error);
    res.status(500).json({ message: "Erreur serveur.", error: error.message }); // Retourner l'erreur détaillée
  }
};
