const express = require('express');
const { getAllUsers, updateUserRole } = require('../controllers/adminController');
const { getUserById } = require('../controllers/userController');
const { requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * GET /admin/users
 * Récupérer tous les utilisateurs (ADMIN uniquement)
 */
router.get('/admin/users', requireRole('ADMIN'), getAllUsers);

/**
 * PATCH /users/:id/role
 * Modifier le rôle d'un utilisateur (ADMIN ou service interne)
 */
router.patch('/users/:id/role', updateUserRole);

/**
 * GET /users/:id
 * Récupérer les informations d'un utilisateur
 */
router.get('/users/:id', getUserById);

module.exports = router;