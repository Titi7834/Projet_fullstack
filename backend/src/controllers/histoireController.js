const histoireService = require('../services/histoireService');

/**
 * POST /auteur/histoires
 * Créer une nouvelle histoire
 */
const createHistoire = async (req, res) => {
    try {
        const { titre, descriptionCourte, theme, tags } = req.body;
        const auteurId = req.user.userId;

        const histoire = await histoireService.createHistoire(auteurId, {
            titre,
            descriptionCourte,
            theme,
            tags
        });

        res.status(201).json({
            success: true,
            message: 'Histoire créée avec succès',
            data: histoire
        });
    } catch (error) {
        console.error('Erreur lors de la création de l\'histoire:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Erreur lors de la création de l\'histoire'
        });
    }
};

/**
 * GET /auteur/histoires
 * Récupérer toutes les histoires de l'auteur connecté
 */
const getMesHistoires = async (req, res) => {
    try {
        const auteurId = req.user.userId;

        const histoires = await histoireService.getHistoiresByAuteur(auteurId);

        res.status(200).json({
            success: true,
            count: histoires.length,
            data: histoires
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des histoires:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Erreur lors de la récupération des histoires'
        });
    }
};

/**
 * GET /auteur/histoires/:id
 * Récupérer une histoire spécifique
 */
const getHistoire = async (req, res) => {
    try {
        const { id } = req.params;

        const histoire = await histoireService.getHistoireById(id);

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
 * PUT /auteur/histoires/:id
 * Mettre à jour une histoire
 */
const updateHistoire = async (req, res) => {
    try {
        const { id } = req.params;
        const auteurId = req.user.userId;
        const updates = req.body;

        const histoire = await histoireService.updateHistoire(id, auteurId, updates);

        res.status(200).json({
            success: true,
            message: 'Histoire mise à jour avec succès',
            data: histoire
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'histoire:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Erreur lors de la mise à jour de l\'histoire'
        });
    }
};

/**
 * DELETE /auteur/histoires/:id
 * Supprimer une histoire
 */
const deleteHistoire = async (req, res) => {
    try {
        const { id } = req.params;
        const auteurId = req.user.userId;

        await histoireService.deleteHistoire(id, auteurId);

        res.status(200).json({
            success: true,
            message: 'Histoire supprimée avec succès'
        });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'histoire:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Erreur lors de la suppression de l\'histoire'
        });
    }
};

/**
 * PATCH /auteur/histoires/:id/publier
 * Publier une histoire
 */
const publishHistoire = async (req, res) => {
    try {
        const { id } = req.params;
        const auteurId = req.user.userId;

        const histoire = await histoireService.publishHistoire(id, auteurId);

        res.status(200).json({
            success: true,
            message: 'Histoire publiée avec succès',
            data: histoire
        });
    } catch (error) {
        console.error('Erreur lors de la publication de l\'histoire:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Erreur lors de la publication de l\'histoire'
        });
    }
};

/**
 * GET /auteur/histoires/:id/pages
 * Récupérer toutes les pages d'une histoire
 */
const getPagesHistoire = async (req, res) => {
    try {
        const { id } = req.params;
        const auteurId = req.user.userId;

        const pages = await histoireService.getPagesHistoire(id, auteurId);

        res.status(200).json({
            success: true,
            count: pages.length,
            data: pages
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des pages:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Erreur lors de la récupération des pages'
        });
    }
};

/**
 * POST /auteur/histoires/:id/pages
 * Créer une nouvelle page
 */
const createPage = async (req, res) => {
    try {
        const { id } = req.params;
        const auteurId = req.user.userId;
        const pageData = req.body;

        const page = await histoireService.createPage(id, auteurId, pageData);

        res.status(201).json({
            success: true,
            message: 'Page créée avec succès',
            data: page
        });
    } catch (error) {
        console.error('Erreur lors de la création de la page:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Erreur lors de la création de la page'
        });
    }
};

/**
 * PUT /auteur/histoires/:histoireId/pages/:pageId
 * Mettre à jour une page
 */
const updatePage = async (req, res) => {
    try {
        const { histoireId, pageId } = req.params;
        const auteurId = req.user.userId;
        const updates = req.body;

        const page = await histoireService.updatePage(histoireId, pageId, auteurId, updates);

        res.status(200).json({
            success: true,
            message: 'Page mise à jour avec succès',
            data: page
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la page:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Erreur lors de la mise à jour de la page'
        });
    }
};

/**
 * DELETE /auteur/histoires/:histoireId/pages/:pageId
 * Supprimer une page
 */
const deletePage = async (req, res) => {
    try {
        const { histoireId, pageId } = req.params;
        const auteurId = req.user.userId;

        await histoireService.deletePage(histoireId, pageId, auteurId);

        res.status(200).json({
            success: true,
            message: 'Page supprimée avec succès'
        });
    } catch (error) {
        console.error('Erreur lors de la suppression de la page:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Erreur lors de la suppression de la page'
        });
    }
};

/**
 * GET /auteur/histoires/:id/statistiques
 * Obtenir les statistiques avancées d'une histoire
 */
const getStatsAvancees = async (req, res) => {
    try {
        const { id } = req.params;
        const auteurId = req.user.userId;

        const stats = await histoireService.getStatsAvancees(id, auteurId);

        res.status(200).json({
            success: true,
            data: stats
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
 * GET /auteur/histoires/:id/preview
 * Prévisualiser une histoire (mode auteur)
 */
const previewHistoire = async (req, res) => {
    try {
        const { id } = req.params;
        const auteurId = req.user.userId;

        const preview = await histoireService.previewHistoire(id, auteurId);

        res.status(200).json({
            success: true,
            data: preview
        });
    } catch (error) {
        console.error('Erreur lors de la prévisualisation:', error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Erreur lors de la prévisualisation'
        });
    }
};

module.exports = {
    createHistoire,
    getMesHistoires,
    getHistoire,
    updateHistoire,
    deleteHistoire,
    publishHistoire,
    getPagesHistoire,
    createPage,
    updatePage,
    deletePage,
    getStatsAvancees,
    previewHistoire
};

