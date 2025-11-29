const User = require('../model/user');

/**
 * Récupérer les informations d'un utilisateur
 */
const getUserById = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        const error = new Error('Utilisateur non trouvé');
        error.statusCode = 404;
        throw error;
    }

    return {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        statutBanni: user.statutBanni,
        createdAt: user.createdAt
    };
};

module.exports = {
    getUserById
};
