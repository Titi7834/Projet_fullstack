const adminService = require('../services/adminService');

/**
 * GET /admin/users
 * Récupérer tous les utilisateurs (ADMIN uniquement)
 */
const getAllUsers = async (req, res) => {
    try {
        const users = await adminService.getAllUsers();

        res.status(200).json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Erreur lors de la récupération des utilisateurs'
        });
    }
};/**
 * PATCH /users/:id/role
 * Modifier le rôle d'un utilisateur (ADMIN uniquement)
 */
const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        const user = await adminService.updateUserRole(id, role);

        res.status(200).json({
            success: true,
            message: 'Rôle de l\'utilisateur mis à jour avec succès',
            user
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du rôle:', error);
        res.status(error.statusCode || 500).json({
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

        const user = await adminService.toggleBanUser(id, ban);

        res.status(200).json({
            success: true,
            message: ban ? 'Utilisateur banni avec succès' : 'Utilisateur débanni avec succès',
            user
        });
    } catch (error) {
        console.error('Erreur lors du bannissement:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Erreur lors du bannissement'
        });
    }
};/**
 * PATCH /admin/histoires/:id/suspend
 * Suspendre ou réactiver une histoire (ADMIN uniquement)
 */
const toggleSuspendHistoire = async (req, res) => {
    try {
        const { id } = req.params;
        const { suspend } = req.body;

        const histoire = await adminService.toggleSuspendHistoire(id, suspend);

        res.status(200).json({
            success: true,
            message: suspend ? 'Histoire suspendue avec succès' : 'Histoire réactivée avec succès',
            histoire
        });
    } catch (error) {
        console.error('Erreur lors de la suspension:', error);
        res.status(error.statusCode || 500).json({
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
        const data = await adminService.getStatistiquesGlobales();

        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
        res.status(error.statusCode || 500).json({
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
        const histoires = await adminService.getAllHistoires();

        res.status(200).json({
            success: true,
            count: histoires.length,
            data: histoires
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des histoires:', error);
        res.status(error.statusCode || 500).json({
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
