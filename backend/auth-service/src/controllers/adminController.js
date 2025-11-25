const User = require('../model/user');
const { Histoire } = require('../model/histoire');
const { Partie } = require('../model/lecteur');
const mongoose = require('mongoose');

/**
 * GET /admin/users
 * Récupérer tous les utilisateurs (ADMIN uniquement)
 */
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        
        res.status(200).json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Erreur lors de la récupération des utilisateurs'
        });
    }
};

/**
 * PATCH /users/:id/role
 * Modifier le rôle d'un utilisateur (ADMIN uniquement)
 */
const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        // Valider que l'ID est un ObjectId valide
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID utilisateur invalide'
            });
        }

        if (!role || !['LECTEUR', 'AUTEUR', 'ADMIN'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Le rôle doit être LECTEUR, AUTEUR ou ADMIN'
            });
        }

        const user = await User.findByIdAndUpdate(
            id,
            { role },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Rôle de l\'utilisateur mis à jour avec succès',
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                role: user.role,
                statutBanni: user.statutBanni,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du rôle:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Erreur lors de la mise à jour du rôle'
        });
    }
};

/**
 * PATCH /admin/users/:id/ban
 * Bannir ou débannir un utilisateur (ADMIN uniquement)
 */
const toggleBanUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { ban } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID utilisateur invalide'
            });
        }

        const user = await User.findByIdAndUpdate(
            id,
            { statutBanni: ban },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        res.status(200).json({
            success: true,
            message: ban ? 'Utilisateur banni avec succès' : 'Utilisateur débanni avec succès',
            user
        });
    } catch (error) {
        console.error('Erreur lors du bannissement:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Erreur lors du bannissement'
        });
    }
};

/**
 * PATCH /admin/histoires/:id/suspend
 * Suspendre ou réactiver une histoire (ADMIN uniquement)
 */
const toggleSuspendHistoire = async (req, res) => {
    try {
        const { id } = req.params;
        const { suspend } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID histoire invalide'
            });
        }

        const statut = suspend ? 'suspendue' : 'publiée';

        const histoire = await Histoire.findByIdAndUpdate(
            id,
            { statut },
            { new: true, runValidators: true }
        ).populate('auteur', 'username email');

        if (!histoire) {
            return res.status(404).json({
                success: false,
                message: 'Histoire non trouvée'
            });
        }

        res.status(200).json({
            success: true,
            message: suspend ? 'Histoire suspendue avec succès' : 'Histoire réactivée avec succès',
            histoire
        });
    } catch (error) {
        console.error('Erreur lors de la suspension:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Erreur lors de la suspension'
        });
    }
};

/**
 * GET /admin/statistiques
 * Obtenir les statistiques globales (ADMIN uniquement)
 */
const getStatistiquesGlobales = async (req, res) => {
    try {
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

        res.status(200).json({
            success: true,
            data: {
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
            }
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Erreur lors de la récupération des statistiques'
        });
    }
};

/**
 * GET /admin/histoires
 * Obtenir toutes les histoires (ADMIN uniquement)
 */
const getAllHistoires = async (req, res) => {
    try {
        const histoires = await Histoire.find()
            .populate('auteur', 'username email statutBanni')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: histoires.length,
            data: histoires
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des histoires:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Erreur lors de la récupération des histoires'
        });
    }
};

module.exports = {
    getAllUsers,
    updateUserRole,
    toggleBanUser,
    toggleSuspendHistoire,
    getStatistiquesGlobales,
    getAllHistoires

};
