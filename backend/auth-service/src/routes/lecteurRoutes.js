const express = require('express');
const router = express.Router();
const lecteurController = require('../controllers/lecteurController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Routes publiques (pas besoin d'authentification pour voir les histoires)
router.get('/histoires', lecteurController.getHistoiresPubliees);

// Routes protégées (nécessite authentification)
router.use(authMiddleware);

router.get('/histoires/:id/commencer', lecteurController.commencerHistoire);
router.get('/histoires/:histoireId/pages/:pageId', lecteurController.getPage);
router.post('/parties/terminer', lecteurController.terminerPartie);
router.get('/mes-parties', lecteurController.getMesParties);
router.get('/histoires/:id/statistiques', lecteurController.getStatistiquesHistoire);
router.get('/histoires/:id', lecteurController.getHistoireById);

module.exports = router;
