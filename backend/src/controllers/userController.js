const userService = require('../services/userService');

/**
 * GET /api/users/:id
 * Récupérer les informations d'un utilisateur
 */
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await userService.getUserById(id);

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Erreur lors de la récupération de l\'utilisateur'
        });
    }
};

module.exports = {
    getUserById
};
