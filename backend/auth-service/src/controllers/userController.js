const User = require('../model/user');

/**
 * GET /api/users/:id
 * Récupérer les informations d'un utilisateur
 */
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                statutBanni: user.statutBanni,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Erreur lors de la récupération de l\'utilisateur'
        });
    }
};

module.exports = {
    getUserById
};
