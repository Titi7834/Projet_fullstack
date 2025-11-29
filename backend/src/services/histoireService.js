const { Histoire } = require('../model/histoire');
const { Partie } = require('../model/lecteur');
const { PartieEnCours } = require('../model/partieEnCours');

/**
 * Créer une nouvelle histoire
 */
const createHistoire = async (auteurId, histoireData) => {
    const { titre, descriptionCourte, tags, theme } = histoireData;
    
    const histoire = new Histoire({
        titre,
        descriptionCourte,
        tags: tags || [],
        theme,
        auteur: auteurId,
        statut: 'brouillon'
    });

    await histoire.save();
    return histoire;
};

/**
 * Obtenir toutes les histoires d'un auteur
 */
const getHistoiresByAuteur = async (auteurId) => {
    const histoires = await Histoire.find({ auteur: auteurId })
        .sort({ createdAt: -1 })
        .populate('pageDepart');

    return histoires;
};

/**
 * Obtenir une histoire spécifique
 */
const getHistoireById = async (histoireId) => {
    const histoire = await Histoire.findById(histoireId)
        .populate('auteur', 'username email')
        .populate('pageDepart');

    if (!histoire) {
        const error = new Error('Histoire non trouvée');
        error.statusCode = 404;
        throw error;
    }

    return histoire;
};

/**
 * Vérifier que l'utilisateur est l'auteur de l'histoire
 */
const verifyAuteur = async (histoireId, auteurId) => {
    const histoire = await Histoire.findOne({ 
        _id: histoireId,
        auteur: auteurId
    });

    if (!histoire) {
        const error = new Error('Histoire non trouvée ou vous n\'êtes pas l\'auteur');
        error.statusCode = 404;
        throw error;
    }

    return histoire;
};

/**
 * Mettre à jour une histoire
 */
const updateHistoire = async (histoireId, auteurId, updateData) => {
    const histoire = await verifyAuteur(histoireId, auteurId);

    const { titre, descriptionCourte, tags, statut, pageDepart, theme } = updateData;

    if (titre) histoire.titre = titre;
    if (descriptionCourte) histoire.descriptionCourte = descriptionCourte;
    if (tags) histoire.tags = tags;
    if (statut) histoire.statut = statut;
    if (pageDepart) histoire.pageDepart = pageDepart;
    if (theme) histoire.theme = theme;

    await histoire.save();
    return histoire;
};

/**
 * Supprimer une histoire et toutes ses parties
 */
const deleteHistoire = async (histoireId, auteurId) => {
    const histoire = await Histoire.findOneAndDelete({ 
        _id: histoireId,
        auteur: auteurId
    });

    if (!histoire) {
        const error = new Error('Histoire non trouvée ou vous n\'êtes pas l\'auteur');
        error.statusCode = 404;
        throw error;
    }

    // Supprimer toutes les parties terminées et en cours associées
    await Promise.all([
        Partie.deleteMany({ histoire: histoireId }),
        PartieEnCours.deleteMany({ histoire: histoireId })
    ]);

    return histoire;
};

/**
 * Publier une histoire
 */
const publishHistoire = async (histoireId, auteurId) => {
    const histoire = await verifyAuteur(histoireId, auteurId);

    if (!histoire.pageDepart) {
        const error = new Error('Vous devez définir une page de départ avant de publier');
        error.statusCode = 400;
        throw error;
    }

    histoire.statut = 'publiée';
    await histoire.save();

    return histoire;
};

/**
 * Obtenir toutes les pages d'une histoire
 */
const getPagesHistoire = async (histoireId, auteurId) => {
    const histoire = await verifyAuteur(histoireId, auteurId);
    return histoire.pages;
};

/**
 * Créer une nouvelle page
 */
const createPage = async (histoireId, auteurId, pageData) => {
    const histoire = await verifyAuteur(histoireId, auteurId);

    const { texte, titre, choix, statutFin } = pageData;

    const nouvellePage = {
        texte,
        titre,
        choix: choix || [],
        statutFin: statutFin || false
    };

    histoire.pages.push(nouvellePage);
    await histoire.save();

    const pageCreee = histoire.pages[histoire.pages.length - 1];
    return pageCreee;
};

/**
 * Mettre à jour une page
 */
const updatePage = async (histoireId, pageId, auteurId, pageData) => {
    const histoire = await verifyAuteur(histoireId, auteurId);

    const page = histoire.pages.id(pageId);

    if (!page) {
        const error = new Error('Page non trouvée');
        error.statusCode = 404;
        throw error;
    }

    const { texte, titre, choix, statutFin } = pageData;

    if (texte) page.texte = texte;
    if (titre !== undefined) page.titre = titre;
    if (choix) page.choix = choix;
    if (statutFin !== undefined) page.statutFin = statutFin;

    await histoire.save();
    return page;
};

/**
 * Supprimer une page
 */
const deletePage = async (histoireId, pageId, auteurId) => {
    const histoire = await verifyAuteur(histoireId, auteurId);

    const page = histoire.pages.id(pageId);

    if (!page) {
        const error = new Error('Page non trouvée');
        error.statusCode = 404;
        throw error;
    }

    page.deleteOne();
    await histoire.save();
    return true;
};

/**
 * Obtenir les statistiques avancées d'une histoire
 */
const getStatsAvancees = async (histoireId, auteurId) => {
    const histoire = await verifyAuteur(histoireId, auteurId);

    // Parties terminées
    const partiesTerminees = await Partie.find({ histoire: histoireId });
    
    // Parties abandonnées (en cours mais pas terminées)
    const partiesAbandonneesCount = await PartieEnCours.countDocuments({ 
        histoire: histoireId 
    });

    // Distribution par fin
    const distributionFins = {};
    const pagesFinales = histoire.pages.filter(p => p.statutFin);
    
    pagesFinales.forEach(page => {
        const label = page.labelFin || page.titre || 'Fin sans nom';
        distributionFins[label] = {
            pageId: page._id,
            count: 0,
            label
        };
    });

    partiesTerminees.forEach(partie => {
        const pageFin = histoire.pages.id(partie.pageFin);
        if (pageFin) {
            const label = pageFin.labelFin || pageFin.titre || 'Fin sans nom';
            if (distributionFins[label]) {
                distributionFins[label].count++;
            }
        }
    });

    // Taux de complétion
    const nbLectures = histoire.statistiques.nbFoisCommencee;
    const nbFins = histoire.statistiques.nbFoisFinie;
    const nbFinsTotal = pagesFinales.length;
    const nbFinsAtteintes = Object.values(distributionFins).filter(fin => fin.count > 0).length;
    const tauxCompletion = nbFinsTotal > 0 ? ((nbFinsAtteintes / nbFinsTotal) * 100).toFixed(1) : 0;

    return {
        nbLectures,
        nbFins,
        nbPartiesAbandonees: partiesAbandonneesCount,
        tauxCompletion: parseFloat(tauxCompletion),
        distributionFins: Object.values(distributionFins),
        noteMoyenne: histoire.noteMoyenne,
        nbCommentaires: histoire.commentaires.length
    };
};

/**
 * Preview d'une histoire (mode auteur, ne compte pas dans les stats)
 */
const previewHistoire = async (histoireId, auteurId) => {
    const histoire = await Histoire.findOne({
        _id: histoireId,
        auteur: auteurId
    }).populate('auteur', 'username');

    if (!histoire) {
        const error = new Error('Histoire non trouvée ou vous n\'êtes pas l\'auteur');
        error.statusCode = 404;
        throw error;
    }

    if (!histoire.pageDepart) {
        const error = new Error('Cette histoire n\'a pas de page de départ');
        error.statusCode = 400;
        throw error;
    }

    const pageDepart = histoire.pages.id(histoire.pageDepart);

    if (!pageDepart) {
        const error = new Error('Page de départ non trouvée');
        error.statusCode = 400;
        throw error;
    }

    return {
        histoire,
        pageActuelle: pageDepart,
        previewMode: true
    };
};

module.exports = {
    createHistoire,
    getHistoiresByAuteur,
    getHistoireById,
    verifyAuteur,
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
