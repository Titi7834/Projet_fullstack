const { Histoire } = require('../model/histoire');
const { Partie } = require('../model/lecteur');
const { PartieEnCours } = require('../model/partieEnCours');

// Créer une nouvelle histoire
exports.createHistoire = async (req, res) => {
    try {
        const { titre, descriptionCourte, tags, theme } = req.body;
        
        const histoire = new Histoire({
            titre,
            descriptionCourte,
            tags: tags || [],
            theme,
            auteur: req.user._id,
            statut: 'brouillon'
        });

        await histoire.save();
        
        res.status(201).json({
            success: true,
            data: histoire,
            message: 'Histoire créée avec succès'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Obtenir toutes les histoires de l'auteur connecté
exports.getMesHistoires = async (req, res) => {
    try {
        const histoires = await Histoire.find({ auteur: req.user._id })
            .sort({ createdAt: -1 })
            .populate('pageDepart');

        if (histoires.length === 0) {
            return res.status(200).json({
                success: true,
                data: [],
                message: 'Aucune histoire trouvée'
            });
        }

        res.json({
            success: true,
            data: histoires
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Obtenir une histoire spécifique
exports.getHistoire = async (req, res) => {
    try {
        const histoire = await Histoire.findById(req.params.id)
            .populate('auteur', 'username email')
            .populate('pageDepart');

        if (!histoire) {
            return res.status(404).json({
                success: false,
                message: 'Histoire non trouvée'
            });
        }

        res.json({
            success: true,
            data: histoire
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Mettre à jour une histoire
exports.updateHistoire = async (req, res) => {
    try {
        const { titre, descriptionCourte, tags, statut, pageDepart, theme } = req.body;
        
        const histoire = await Histoire.findOne({ 
            _id: req.params.id,
            auteur: req.user._id
        });

        if (!histoire) {
            return res.status(404).json({
                success: false,
                message: 'Histoire non trouvée ou vous n\'êtes pas l\'auteur'
            });
        }

        if (titre) histoire.titre = titre;
        if (descriptionCourte) histoire.descriptionCourte = descriptionCourte;
        if (tags) histoire.tags = tags;
        if (statut) histoire.statut = statut;
        if (pageDepart) histoire.pageDepart = pageDepart;
        if (theme) histoire.theme = theme;

        await histoire.save();

        res.json({
            success: true,
            data: histoire,
            message: 'Histoire mise à jour avec succès'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Supprimer une histoire
exports.deleteHistoire = async (req, res) => {
    try {
        const histoire = await Histoire.findOneAndDelete({ 
            _id: req.params.id,
            auteur: req.user._id
        });

        if (!histoire) {
            return res.status(404).json({
                success: false,
                message: 'Histoire non trouvée ou vous n\'êtes pas l\'auteur'
            });
        }

        // Supprimer toutes les parties terminées et en cours associées
        await Promise.all([
            Partie.deleteMany({ histoire: req.params.id }),
            PartieEnCours.deleteMany({ histoire: req.params.id })
        ]);

        res.json({
            success: true,
            message: 'Histoire supprimée avec succès'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Publier une histoire
exports.publishHistoire = async (req, res) => {
    try {
        const histoire = await Histoire.findOne({ 
            _id: req.params.id,
            auteur: req.user._id
        });

        if (!histoire) {
            return res.status(404).json({
                success: false,
                message: 'Histoire non trouvée ou vous n\'êtes pas l\'auteur'
            });
        }

        if (!histoire.pageDepart) {
            return res.status(400).json({
                success: false,
                message: 'Vous devez définir une page de départ avant de publier'
            });
        }

        histoire.statut = 'publiée';
        await histoire.save();

        res.json({
            success: true,
            data: histoire,
            message: 'Histoire publiée avec succès'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Obtenir toutes les pages d'une histoire
exports.getPagesHistoire = async (req, res) => {
    try {
        const histoire = await Histoire.findOne({ 
            _id: req.params.id,
            auteur: req.user._id
        });

        if (!histoire) {
            return res.status(404).json({
                success: false,
                message: 'Histoire non trouvée ou vous n\'êtes pas l\'auteur'
            });
        }

        res.json({
            success: true,
            data: histoire.pages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Créer une nouvelle page
exports.createPage = async (req, res) => {
    try {
        const { texte, titre, choix, statutFin } = req.body;
        const histoireId = req.params.id;

        // Vérifier que l'utilisateur est l'auteur de l'histoire
        const histoire = await Histoire.findOne({ 
            _id: histoireId,
            auteur: req.user._id
        });

        if (!histoire) {
            return res.status(404).json({
                success: false,
                message: 'Histoire non trouvée ou vous n\'êtes pas l\'auteur'
            });
        }

        // Créer la nouvelle page embarquée
        const nouvellePage = {
            texte,
            titre,
            choix: choix || [],
            statutFin: statutFin || false
        };

        histoire.pages.push(nouvellePage);
        await histoire.save();

        // Récupérer la page qui vient d'être ajoutée
        const pageCreee = histoire.pages[histoire.pages.length - 1];

        res.status(201).json({
            success: true,
            data: pageCreee,
            message: 'Page créée avec succès'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Mettre à jour une page
exports.updatePage = async (req, res) => {
    try {
        const { texte, titre, choix, statutFin } = req.body;
        const { id, pageId } = req.params;
        
        const histoire = await Histoire.findOne({ 
            _id: id,
            auteur: req.user._id
        });

        if (!histoire) {
            return res.status(404).json({
                success: false,
                message: 'Histoire non trouvée ou vous n\'êtes pas l\'auteur'
            });
        }

        const page = histoire.pages.id(pageId);

        if (!page) {
            return res.status(404).json({
                success: false,
                message: 'Page non trouvée'
            });
        }

        if (texte) page.texte = texte;
        if (titre !== undefined) page.titre = titre;
        if (choix) page.choix = choix;
        if (statutFin !== undefined) page.statutFin = statutFin;

        await histoire.save();

        res.json({
            success: true,
            data: page,
            message: 'Page mise à jour avec succès'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Supprimer une page
exports.deletePage = async (req, res) => {
    try {
        const { id, pageId } = req.params;
        
        const histoire = await Histoire.findOne({ 
            _id: id,
            auteur: req.user._id
        });

        if (!histoire) {
            return res.status(404).json({
                success: false,
                message: 'Histoire non trouvée ou vous n\'êtes pas l\'auteur'
            });
        }

        const page = histoire.pages.id(pageId);

        if (!page) {
            return res.status(404).json({
                success: false,
                message: 'Page non trouvée'
            });
        }

        // Supprimer la page du tableau
        page.deleteOne();
        await histoire.save();

        res.json({
            success: true,
            message: 'Page supprimée avec succès'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Obtenir les statistiques avancées d'une histoire (pour l'auteur)
exports.getStatsAvancees = async (req, res) => {
    try {
        const { Partie } = require('../model/lecteur');
        const { PartieEnCours } = require('../model/partieEnCours');
        
        const histoire = await Histoire.findOne({
            _id: req.params.id,
            auteur: req.user._id
        });

        if (!histoire) {
            return res.status(404).json({
                success: false,
                message: 'Histoire non trouvée ou vous n\'êtes pas l\'auteur'
            });
        }

        // Parties terminées
        const partiesTerminees = await Partie.find({ histoire: req.params.id });
        
        // Parties abandonnées (en cours mais pas terminées)
        const partiesAbandonneesCount = await PartieEnCours.countDocuments({ 
            histoire: req.params.id 
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

        // Taux de complétion = pourcentage des fins différentes atteintes au moins une fois
        const nbLectures = histoire.statistiques.nbFoisCommencee;
        const nbFins = histoire.statistiques.nbFoisFinie;
        const nbFinsTotal = pagesFinales.length;
        const nbFinsAtteintes = Object.values(distributionFins).filter(fin => fin.count > 0).length;
        const tauxCompletion = nbFinsTotal > 0 ? ((nbFinsAtteintes / nbFinsTotal) * 100).toFixed(1) : 0;

        res.json({
            success: true,
            data: {
                nbLectures,
                nbFins,
                nbPartiesAbandonees: partiesAbandonneesCount,
                tauxCompletion: parseFloat(tauxCompletion),
                distributionFins: Object.values(distributionFins),
                noteMoyenne: histoire.noteMoyenne,
                nbCommentaires: histoire.commentaires.length
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Mode preview pour l'auteur (ne compte pas dans les stats)
exports.previewHistoire = async (req, res) => {
    try {
        const histoire = await Histoire.findOne({
            _id: req.params.id,
            auteur: req.user._id
        }).populate('auteur', 'username');

        if (!histoire) {
            return res.status(404).json({
                success: false,
                message: 'Histoire non trouvée ou vous n\'êtes pas l\'auteur'
            });
        }

        if (!histoire.pageDepart) {
            return res.status(400).json({
                success: false,
                message: 'Cette histoire n\'a pas de page de départ'
            });
        }

        const pageDepart = histoire.pages.id(histoire.pageDepart);

        if (!pageDepart) {
            return res.status(400).json({
                success: false,
                message: 'Page de départ non trouvée'
            });
        }

        // Ne pas incrémenter les statistiques en mode preview
        res.json({
            success: true,
            data: {
                histoire,
                pageActuelle: pageDepart,
                previewMode: true
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

