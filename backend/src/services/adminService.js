const User = require('../model/user');
const { Histoire } = require('../model/histoire');
const { Partie } = require('../model/lecteur');
const mongoose = require('mongoose');

/**
 * Récupérer tous les utilisateurs
 */
const getAllUsers = async () => {
    const users = await User.find().select('-password');
    return users;
};

/**
 * Modifier le rôle d'un utilisateur
 */
const updateUserRole = async (userId, newRole) => {
    // Valider que l'ID est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        const error = new Error('ID utilisateur invalide');
        error.statusCode = 400;
        throw error;
    }

    if (!newRole || !['LECTEUR', 'AUTEUR', 'ADMIN'].includes(newRole)) {
        const error = new Error('Le rôle doit être LECTEUR, AUTEUR ou ADMIN');
        error.statusCode = 400;
        throw error;
    }

    const user = await User.findByIdAndUpdate(
        userId,
        { role: newRole },
        { new: true, runValidators: true }
    );

    if (!user) {
        const error = new Error('Utilisateur non trouvé');
        error.statusCode = 404;
        throw error;
    }

    return {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        statutBanni: user.statutBanni,
        createdAt: user.createdAt
    };
};

/**
 * Bannir ou débannir un utilisateur
 */
const toggleBanUser = async (userId, banStatus) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        const error = new Error('ID utilisateur invalide');
        error.statusCode = 400;
        throw error;
    }

    const user = await User.findByIdAndUpdate(
        userId,
        { statutBanni: banStatus },
        { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
        const error = new Error('Utilisateur non trouvé');
        error.statusCode = 404;
        throw error;
    }

    return user;
};

/**
 * Suspendre ou réactiver une histoire
 */
const toggleSuspendHistoire = async (histoireId, suspendStatus) => {
    if (!mongoose.Types.ObjectId.isValid(histoireId)) {
        const error = new Error('ID histoire invalide');
        error.statusCode = 400;
        throw error;
    }

    const statut = suspendStatus ? 'suspendue' : 'publiée';

    const histoire = await Histoire.findByIdAndUpdate(
        histoireId,
        { statut },
        { new: true, runValidators: true }
    ).populate('auteur', 'username email');

    if (!histoire) {
        const error = new Error('Histoire non trouvée');
        error.statusCode = 404;
        throw error;
    }

    return histoire;
};

/**
 * Obtenir les statistiques globales
 */
const getStatistiquesGlobales = async () => {
    // Statistiques des utilisateurs
    const totalUsers = await User.countDocuments();
    const totalAuteurs = await User.countDocuments({ role: 'AUTEUR' });
    const totalLecteurs = await User.countDocuments({ role: 'LECTEUR' });
    const totalBannis = await User.countDocuments({ statutBanni: true });

    // Statistiques des histoires
    const totalHistoires = await Histoire.countDocuments();
    const histoiresPubilees = await Histoire.countDocuments({ statut: 'publiée' });
    const histoiresBrouillon = await Histoire.countDocuments({ statut: 'brouillon' });
    const histoiresSuspendues = await Histoire.countDocuments({ statut: 'suspendue' });

    // Statistiques des parties
    const totalParties = await Partie.countDocuments();

    // Histoires les plus jouées
    const histoiresPlusJouees = await Histoire.find()
        .sort({ nbFoisCommencee: -1 })
        .limit(10)
        .populate('auteur', 'username');

    return {
        utilisateurs: {
            total: totalUsers,
            auteurs: totalAuteurs,
            lecteurs: totalLecteurs,
            bannis: totalBannis
        },
        histoires: {
            total: totalHistoires,
            publiees: histoiresPubilees,
            brouillon: histoiresBrouillon,
            suspendues: histoiresSuspendues
        },
        parties: {
            total: totalParties
        },
        topHistoires: histoiresPlusJouees
    };
};

/**
 * Obtenir toutes les histoires
 */
const getAllHistoires = async () => {
    const histoires = await Histoire.find()
        .populate('auteur', 'username email statutBanni')
        .sort({ createdAt: -1 });

    return histoires;
};

module.exports = {
    getAllUsers,
    updateUserRole,
    toggleBanUser,
    toggleSuspendHistoire,
    getStatistiquesGlobales,
    getAllHistoires
};
