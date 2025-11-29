const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/user');

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Générer un JWT token
 */
const generateToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Créer un nouvel utilisateur
 */
const registerUser = async (userData) => {
    const { email, username, password, role } = userData;

    if (!email || !username || !password) {
        throw new Error('Email, username et password sont obligatoires');
    }

    const existingUser = await User.findByEmailOrUsername(email);
    if (existingUser) {
        const error = new Error('Cet email ou nom d\'utilisateur est déjà utilisé');
        error.statusCode = 409;
        throw error;
    }

    const newUser = new User({
        email,
        username,
        password: await bcrypt.hash(password, 10),
        role: role && ['LECTEUR', 'AUTEUR', 'ADMIN'].includes(role) ? role : 'LECTEUR'
    });

    await newUser.save();

    const token = generateToken(newUser._id);

    return {
        token,
        user: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role
        }
    };
};

/**
 * Authentifier un utilisateur
 */
const loginUser = async (credentials) => {
    const { identifier, password } = credentials;

    if (!identifier || !password) {
        const error = new Error('Email/username et password sont obligatoires');
        error.statusCode = 400;
        throw error;
    }

    const user = await User.findByEmailOrUsername(identifier).select('+password');
    if (!user) {
        const error = new Error('Email/username ou mot de passe incorrect');
        error.statusCode = 401;
        throw error;
    }

    if (user.statutBanni) {
        const error = new Error('Votre compte a été banni');
        error.statusCode = 403;
        throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        const error = new Error('Email ou mot de passe incorrect');
        error.statusCode = 401;
        throw error;
    }

    const token = generateToken(user._id);

    return {
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    };
};

/**
 * Vérifier et décoder un token
 */
const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        const err = new Error('Token invalide');
        err.statusCode = 403;
        throw err;
    }
};

/**
 * Récupérer les informations d'un utilisateur
 */
const getUserById = async (userId) => {
    const user = await User.findById(userId).select('-password');
    if (!user) {
        const error = new Error('Utilisateur non trouvé');
        error.statusCode = 404;
        throw error;
    }
    return user;
};

module.exports = {
    registerUser,
    loginUser,
    verifyToken,
    getUserById,
    generateToken
};
