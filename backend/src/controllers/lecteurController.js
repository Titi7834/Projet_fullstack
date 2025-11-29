const lecteurService = require('../services/lecteurService');

/**
 * GET /lecteur/histoires
 * Obtenir toutes les histoires publiées
 */
const getHistoiresPubliees = async (req, res) => {
    try {
        const { search, theme } = req.query;

        const histoires = await lecteurService.getHistoiresPubliees({ search, theme });

        res.status(200).json({
            success: true,
            count: histoires.length,
            data: histoires
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des histoires publiées:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Erreur lors de la récupération des histoires publiées'
        });
    }
};

/**
 * POST /lecteur/histoires/:id/commencer
 * Commencer une nouvelle partie
 */
const commencerHistoire = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await lecteurService.commencerHistoire(id);

        res.status(200).json({
            success: true,
            message: 'Partie commencée avec succès',
            data: {
                histoire: result.histoire,
                pageActuelle: result.pageActuelle
            }
        });
    } catch (error) {
        console.error('Erreur lors du démarrage de la partie:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Erreur lors du démarrage de la partie'
        });
    }
};

/**
 * GET /lecteur/histoires/:histoireId/pages/:pageId
 * Obtenir une page spécifique
 */
const getPage = async (req, res) => {
    try {
        const { histoireId, pageId } = req.params;

        const page = await lecteurService.getPage(histoireId, pageId);

        res.status(200).json({
            success: true,
            data: page
        });
    } catch (error) {
        console.error('Erreur lors de la récupération de la page:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Erreur lors de la récupération de la page'
        });
    }
};

/**
 * POST /lecteur/histoires/:id/terminer
 * Terminer une partie
 */
const terminerPartie = async (req, res) => {
    try {
        const { id } = req.params;
        const lecteurId = req.user.userId;
        const { pageFinId, parcours } = req.body;

        const partie = await lecteurService.terminerPartie(lecteurId, {
            histoireId: id,
            pageFinId,
            parcours
        });

        res.status(201).json({
            success: true,
            message: 'Partie terminée avec succès',
            data: partie
        });
    } catch (error) {
        console.error('Erreur lors de la fin de partie:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Erreur lors de la fin de partie'
        });
    }
};

/**
 * GET /lecteur/parties
 * Obtenir les parties d'un lecteur
 */
const getMesParties = async (req, res) => {
    try {
        const lecteurId = req.user.userId;

        const parties = await lecteurService.getPartiesByLecteur(lecteurId);

        res.status(200).json({
            success: true,
            count: parties.length,
            data: parties
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des parties:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Erreur lors de la récupération des parties'
        });
    }
};

/**
 * GET /lecteur/histoires/:id/statistiques
 * Obtenir les statistiques d'une histoire
 */
const getStatistiquesHistoire = async (req, res) => {
    try {
        const { id } = req.params;

        const statistiques = await lecteurService.getStatistiquesHistoire(id);

        res.status(200).json({
            success: true,
            data: statistiques
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Erreur lors de la récupération des statistiques'
        });
    }
};

/**
 * GET /lecteur/histoires/:id
 * Obtenir une histoire par ID
 */
const getHistoireById = async (req, res) => {
    try {
        const { id } = req.params;

        const histoire = await lecteurService.getHistoireById(id);

        res.status(200).json({
            success: true,
            data: histoire
        });
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'histoire:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Erreur lors de la récupération de l\'histoire'
        });
    }
};

/**
 * POST /lecteur/histoires/:id/sauvegarder
 * Sauvegarder la progression
 */
const sauvegarderProgression = async (req, res) => {
    try {
        const { id } = req.params;
        const lecteurId = req.user.userId;
        const { pageActuelle, parcours } = req.body;

        const partie = await lecteurService.sauvegarderProgression(lecteurId, {
            histoireId: id,
            pageActuelle,
            parcours
        });

        res.status(200).json({
            success: true,
            message: 'Progression sauvegardée avec succès',
            data: partie
        });
    } catch (error) {
        console.error('Erreur lors de la sauvegarde de la progression:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Erreur lors de la sauvegarde de la progression'
        });
    }
};

/**
 * GET /lecteur/histoires/:id/reprendre
 * Reprendre une partie sauvegardée
 */
const reprendrePartie = async (req, res) => {
    try {
        const { id } = req.params;
        const lecteurId = req.user.userId;

        const result = await lecteurService.reprendrePartie(lecteurId, id);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Aucune partie en cours trouvée'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Partie reprise avec succès',
            data: {
                histoire: result.histoire,
                pageActuelle: result.pageActuelle,
                parcours: result.parcours
            }
        });
    } catch (error) {
        console.error('Erreur lors de la reprise de la partie:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Erreur lors de la reprise de la partie'
        });
    }
};

/**
 * POST /lecteur/histoires/:id/noter
 * Noter une histoire
 */
const noterHistoire = async (req, res) => {
    try {
        const { id } = req.params;
        const lecteurId = req.user.userId;
        const { note, commentaire } = req.body;

        const result = await lecteurService.noterHistoire(lecteurId, id, { note, commentaire });

        res.status(200).json({
            success: true,
            message: 'Note enregistrée avec succès',
            data: result
        });
    } catch (error) {
        console.error('Erreur lors de la notation:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Erreur lors de la notation'
        });
    }
};

/**
 * POST /lecteur/histoires/:id/signaler
 * Signaler une histoire
 */
const signalerHistoire = async (req, res) => {
    try {
        const { id } = req.params;
        const lecteurId = req.user.userId;
        const { raison } = req.body;

        const result = await lecteurService.signalerHistoire(lecteurId, id, { raison });

        res.status(200).json({
            success: true,
            message: 'Signalement enregistré avec succès',
            data: result
        });
    } catch (error) {
        console.error('Erreur lors du signalement:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Erreur lors du signalement'
        });
    }
};

/**
 * GET /lecteur/histoires/:id/fins-debloquees
 * Obtenir les fins débloquées par un lecteur
 */
const getFinsDebloquees = async (req, res) => {
    try {
        const { id } = req.params;
        const lecteurId = req.user.userId;

        const result = await lecteurService.getFinsDebloquees(lecteurId, id);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des fins débloquées:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Erreur lors de la récupération des fins débloquées'
        });
    }
};

module.exports = {
    getHistoiresPubliees,
    commencerHistoire,
    getPage,
    terminerPartie,
    getMesParties,
    getStatistiquesHistoire,
    getHistoireById,
    sauvegarderProgression,
    reprendrePartie,
    noterHistoire,
    signalerHistoire,
    getFinsDebloquees
};
