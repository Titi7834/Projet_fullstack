const authService = require('../services/authService');

/**
 * POST /auth/register
 * Créer un nouvel utilisateur
 */
const register = async (req, res) => {
    try {
        const { email, username, password, role } = req.body;

        if (!email || !username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email, username et password sont obligatoires'
            });
        }

        const result = await authService.registerUser({
            email,
            username,
            password,
            role: role && ['LECTEUR', 'AUTEUR', 'ADMIN'].includes(role) ? role : 'LECTEUR'
        });

        res.status(201).json({
            success: true,
            message: 'Utilisateur créé avec succès',
            token: result.token,
            user: result.user
        });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Erreur lors de l\'enregistrement'
        });
    }
};

/**
 * POST /auth/login
 * Authentifier un utilisateur
 */
const login = async (req, res) => {
    try {
        const { emailUsername, password } = req.body;

        const identifier = emailUsername;

        if (!identifier || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email/username et password sont obligatoires'
            });
        }

        const result = await authService.loginUser({ identifier, password });

        res.status(200).json({
            success: true,
            message: 'Connexion réussie',
            token: result.token,
            user: result.user
        });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Erreur lors de la connexion'
        });
    }
};

/**
 * GET /auth/me
 * Récupérer les infos de l'utilisateur connecté
 */
const getMe = async (req, res) => {
    try {
        const user = await authService.getUserById(req.user.userId);

        res.status(200).json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role,
                statutBanni: user.statutBanni,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des infos:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Erreur lors de la récupération des infos'
        });
    }
};

module.exports = {
    register,
    login,
    getMe
};
