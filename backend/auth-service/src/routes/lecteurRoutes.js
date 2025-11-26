const express = require('express');
const router = express.Router();
const lecteurController = require('../controllers/lecteurController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Routes publiques (pas besoin d'authentification pour voir les histoires)
router.get('/histoires', lecteurController.getHistoiresPubliees);
router.get('/histoires/:id/statistiques', lecteurController.getStatistiquesHistoire);
router.get('/histoires/:id', lecteurController.getHistoireById);

// Routes protégées (nécessite authentification)
router.use(authMiddleware);

router.get('/histoires/:id/commencer', lecteurController.commencerHistoire);
router.get('/histoires/:id/reprendre', lecteurController.reprendrePartie);
router.get('/histoires/:id/fins-debloquees', lecteurController.getFinsDebloquees);
router.get('/histoires/:histoireId/pages/:pageId', lecteurController.getPage);
router.post('/histoires/:id/noter', lecteurController.noterHistoire);
router.post('/histoires/:id/signaler', lecteurController.signalerHistoire);
router.post('/parties/terminer', lecteurController.terminerPartie);
router.post('/parties/sauvegarder', lecteurController.sauvegarderProgression);
router.post('/parties/statistiques-parcours', lecteurController.getStatistiquesParcours);
router.get('/mes-parties', lecteurController.getMesParties);

module.exports = router;
