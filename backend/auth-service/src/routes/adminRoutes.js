const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware, requireRole } = require('../middleware/authMiddleware');

// Toutes les routes nécessitent le rôle ADMIN
router.use(authMiddleware);
router.use(requireRole(['ADMIN']));

// Gestion des utilisateurs
router.get('/users', adminController.getAllUsers);
router.patch('/users/:id/role', adminController.updateUserRole);
router.patch('/users/:id/ban', adminController.toggleBanUser);

// Gestion des histoires
router.get('/histoires', adminController.getAllHistoires);
router.patch('/histoires/:id/suspend', adminController.toggleSuspendHistoire);

// Statistiques
router.get('/statistiques', adminController.getStatistiquesGlobales);

module.exports = router;
