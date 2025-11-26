const express = require('express');
const router = express.Router();
const histoireController = require('../controllers/histoireController');
const { authMiddleware, requireRole } = require('../middleware/authMiddleware');

// Routes pour les auteurs (nécessite le rôle AUTEUR ou ADMIN)
router.use(authMiddleware);
router.use(requireRole(['AUTEUR', 'ADMIN']));

// Gestion des histoires
router.post('/', histoireController.createHistoire);
router.get('/mes-histoires', histoireController.getMesHistoires);
router.get('/:id', histoireController.getHistoire);
router.put('/:id', histoireController.updateHistoire);
router.delete('/:id', histoireController.deleteHistoire);
router.patch('/:id/publish', histoireController.publishHistoire);

// Stats avancées et preview
router.get('/histoires/:id/stats-avancees', histoireController.getStatsAvancees);
router.get('/histoires/:id/preview', histoireController.previewHistoire);

// Gestion des pages
router.get('/:id/pages', histoireController.getPagesHistoire);
router.post('/:id/pages', histoireController.createPage);
router.put('/:id/pages/:pageId', histoireController.updatePage);
router.delete('/:id/pages/:pageId', histoireController.deletePage);

module.exports = router;
