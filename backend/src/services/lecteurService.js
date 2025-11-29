const { Histoire } = require('../model/histoire');
const { Partie } = require('../model/lecteur');
const { PartieEnCours } = require('../model/partieEnCours');

/**
 * Obtenir toutes les histoires publiées avec recherche et filtres
 */
const getHistoiresPubliees = async (filters = {}) => {
    const { search, theme } = filters;
    
    let query = { statut: 'publiée' };
    
    if (search) {
        query.$or = [
            { titre: { $regex: search, $options: 'i' } },
            { descriptionCourte: { $regex: search, $options: 'i' } },
            { tags: { $in: [new RegExp(search, 'i')] } }
        ];
    }

    if (theme) {
        query.theme = theme;
    }

    const histoires = await Histoire.find(query)
        .populate('auteur', 'username')
        .sort({ 'statistiques.nbFoisCommencee': -1, createdAt: -1 });

    return histoires;
};

/**
 * Commencer une nouvelle partie
 */
const commencerHistoire = async (histoireId) => {
    const histoire = await Histoire.findById(histoireId)
        .populate('auteur', 'username');

    if (!histoire) {
        const error = new Error('Histoire non trouvée');
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

    // Incrémenter le compteur
    histoire.statistiques.nbFoisCommencee += 1;
    await histoire.save();

    return {
        histoire,
        pageActuelle: pageDepart
    };
};

/**
 * Obtenir une page spécifique
 */
const getPage = async (histoireId, pageId) => {
    const histoire = await Histoire.findById(histoireId);

    if (!histoire) {
        const error = new Error('Histoire non trouvée');
        error.statusCode = 404;
        throw error;
    }

    const page = histoire.pages.id(pageId);

    if (!page) {
        const error = new Error('Page non trouvée');
        error.statusCode = 404;
        throw error;
    }

    return page;
};

/**
 * Terminer une partie
 */
const terminerPartie = async (lecteurId, partieData) => {
    const { histoireId, pageFinId, parcours } = partieData;

    const histoire = await Histoire.findById(histoireId);

    if (!histoire) {
        const error = new Error('Histoire non trouvée');
        error.statusCode = 404;
        throw error;
    }

    const pageFin = histoire.pages.id(pageFinId);

    if (!pageFin) {
        const error = new Error('Page de fin non trouvée');
        error.statusCode = 404;
        throw error;
    }

    if (!pageFin.statutFin) {
        const error = new Error('Cette page n\'est pas une page de fin');
        error.statusCode = 400;
        throw error;
    }

    // Enregistrer la partie
    const partie = new Partie({
        lecteur: lecteurId,
        histoire: histoireId,
        pageFin: pageFinId,
        parcours: parcours || [],
        dateFin: new Date()
    });

    await partie.save();

    // Supprimer la partie en cours si elle existe
    await PartieEnCours.deleteOne({
        lecteur: lecteurId,
        histoire: histoireId
    });

    // Incrémenter le compteur de parties finies
    histoire.statistiques.nbFoisFinie += 1;
    await histoire.save();

    return partie;
};

/**
 * Obtenir les parties d'un lecteur
 */
const getPartiesByLecteur = async (lecteurId) => {
    const parties = await Partie.find({ lecteur: lecteurId })
        .populate({
            path: 'histoire',
            select: 'titre descriptionCourte pages',
            populate: {
                path: 'pages'
            }
        })
        .sort({ createdAt: -1 });

    // Enrichir les parties avec les informations de la page de fin
    const partiesEnrichies = parties.map(partie => {
        const partieObj = partie.toObject();
        
        if (partieObj.histoire && partieObj.histoire.pages && partieObj.pageFin) {
            const pageFin = partieObj.histoire.pages.find(
                p => p._id.toString() === partieObj.pageFin.toString()
            );
            
            if (pageFin) {
                partieObj.pageFin = {
                    _id: pageFin._id,
                    titre: pageFin.titre,
                    labelFin: pageFin.labelFin,
                    texte: pageFin.texte
                };
            }
        }
        
        // Nettoyer pour ne pas renvoyer toutes les pages
        if (partieObj.histoire) {
            delete partieObj.histoire.pages;
        }
        
        return partieObj;
    });

    return partiesEnrichies;
};

/**
 * Obtenir les statistiques d'une histoire
 */
const getStatistiquesHistoire = async (histoireId) => {
    const histoire = await Histoire.findById(histoireId);

    if (!histoire) {
        const error = new Error('Histoire non trouvée');
        error.statusCode = 404;
        throw error;
    }

    const parties = await Partie.find({ histoire: histoireId })
        .populate('pageFin', 'titre texte');

    const statistiques = {
        nbFoisCommencee: histoire.statistiques.nbFoisCommencee,
        nbFoisFinie: histoire.statistiques.nbFoisFinie,
        noteMoyenne: histoire.noteMoyenne,
        fins: {}
    };

    parties.forEach(partie => {
        const finId = partie.pageFin._id.toString();
        if (!statistiques.fins[finId]) {
            statistiques.fins[finId] = {
                titre: partie.pageFin.titre,
                texte: partie.pageFin.texte,
                count: 0
            };
        }
        statistiques.fins[finId].count += 1;
    });

    return statistiques;
};

/**
 * Obtenir une histoire par ID
 */
const getHistoireById = async (histoireId) => {
    const histoire = await Histoire.findById(histoireId)
        .populate('pageDepart')
        .populate('auteur', 'username');

    if (!histoire) {
        const error = new Error('Histoire non trouvée');
        error.statusCode = 404;
        throw error;
    }

    return histoire;
};

/**
 * Sauvegarder la progression
 */
const sauvegarderProgression = async (lecteurId, progressionData) => {
    const { histoireId, pageActuelle, parcours } = progressionData;

    const partie = await PartieEnCours.findOneAndUpdate(
        { lecteur: lecteurId, histoire: histoireId },
        {
            pageActuelle,
            parcours: parcours || [],
            derniereMiseAJour: new Date()
        },
        { upsert: true, new: true }
    );

    return partie;
};

/**
 * Reprendre une partie sauvegardée
 */
const reprendrePartie = async (lecteurId, histoireId) => {
    const partieEnCours = await PartieEnCours.findOne({
        lecteur: lecteurId,
        histoire: histoireId
    }).populate({
        path: 'histoire',
        populate: { path: 'auteur', select: 'username' }
    });

    if (!partieEnCours) {
        return null;
    }

    const histoire = partieEnCours.histoire;
    const pageActuelle = histoire.pages.id(partieEnCours.pageActuelle);

    if (!pageActuelle) {
        const error = new Error('Page actuelle non trouvée');
        error.statusCode = 404;
        throw error;
    }

    return {
        histoire,
        pageActuelle,
        parcours: partieEnCours.parcours
    };
};

/**
 * Noter une histoire
 */
const noterHistoire = async (lecteurId, histoireId, noteData) => {
    const { note, commentaire } = noteData;

    if (!note || note < 1 || note > 5) {
        const error = new Error('La note doit être entre 1 et 5');
        error.statusCode = 400;
        throw error;
    }

    const histoire = await Histoire.findById(histoireId);

    if (!histoire) {
        const error = new Error('Histoire non trouvée');
        error.statusCode = 404;
        throw error;
    }

    // Vérifier si l'utilisateur a déjà noté
    const noteExistante = histoire.commentaires.find(
        c => c.userId.toString() === lecteurId.toString()
    );

    if (noteExistante) {
        noteExistante.note = note;
        if (commentaire) noteExistante.commentaire = commentaire;
    } else {
        histoire.commentaires.push({
            userId: lecteurId,
            note,
            commentaire: commentaire || ''
        });
    }

    // Recalculer la note moyenne
    const totalNotes = histoire.commentaires.reduce((sum, c) => sum + c.note, 0);
    histoire.noteMoyenne = totalNotes / histoire.commentaires.length;

    await histoire.save();

    return {
        noteMoyenne: histoire.noteMoyenne,
        nbCommentaires: histoire.commentaires.length
    };
};

/**
 * Signaler une histoire
 */
const signalerHistoire = async (lecteurId, histoireId, signalementData) => {
    const { raison } = signalementData;

    if (!raison) {
        const error = new Error('La raison du signalement est obligatoire');
        error.statusCode = 400;
        throw error;
    }

    const histoire = await Histoire.findById(histoireId);

    if (!histoire) {
        const error = new Error('Histoire non trouvée');
        error.statusCode = 404;
        throw error;
    }

    // Vérifier si l'utilisateur a déjà signalé cette histoire
    const signalementExistant = histoire.signalements.find(
        s => s.userId.toString() === lecteurId.toString()
    );

    if (signalementExistant) {
        const error = new Error('Vous avez déjà signalé cette histoire');
        error.statusCode = 409;
        throw error;
    }

    histoire.signalements.push({
        userId: lecteurId,
        raison,
        date: new Date()
    });

    await histoire.save();

    return {
        nbSignalements: histoire.signalements.length
    };
};

/**
 * Obtenir les fins débloquées par un lecteur
 */
const getFinsDebloquees = async (lecteurId, histoireId) => {
    const parties = await Partie.find({
        lecteur: lecteurId,
        histoire: histoireId
    }).select('pageFin');

    const histoire = await Histoire.findById(histoireId);

    if (!histoire) {
        const error = new Error('Histoire non trouvée');
        error.statusCode = 404;
        throw error;
    }

    const finsDebloquees = parties.map(partie => {
        const pageFin = histoire.pages.id(partie.pageFin);
        return {
            _id: pageFin._id,
            titre: pageFin.titre,
            labelFin: pageFin.labelFin,
            texte: pageFin.texte
        };
    });

    const totalFins = histoire.pages.filter(p => p.statutFin).length;

    return {
        finsDebloquees,
        nbFinsDebloquees: finsDebloquees.length,
        totalFins
    };
};

module.exports = {
    getHistoiresPubliees,
    commencerHistoire,
    getPage,
    terminerPartie,
    getPartiesByLecteur,
    getStatistiquesHistoire,
    getHistoireById,
    sauvegarderProgression,
    reprendrePartie,
    noterHistoire,
    signalerHistoire,
    getFinsDebloquees
};
