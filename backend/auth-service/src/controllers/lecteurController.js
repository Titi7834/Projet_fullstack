const { Histoire, Page } = require('../model/histoire');
const { Partie } = require('../model/lecteur');

// Obtenir toutes les histoires publiées avec recherche
exports.getHistoiresPubliees = async (req, res) => {
    try {
        const { search } = req.query;
        
        let query = { statut: 'publiée' };
        
        if (search) {
            query.$or = [
                { titre: { $regex: search, $options: 'i' } },
                { descriptionCourte: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        const histoires = await Histoire.find(query)
            .populate('auteur', 'username')
            .sort({ nbFoisCommencee: -1, createdAt: -1 });

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

// Démarrer la lecture d'une histoire
exports.commencerHistoire = async (req, res) => {
    try {
        const histoire = await Histoire.findById(req.params.id)
            .populate('pageDepart')
            .populate('auteur', 'username');

        if (!histoire) {
            return res.status(404).json({
                success: false,
                message: 'Histoire non trouvée'
            });
        }

        if (histoire.statut !== 'publiée') {
            return res.status(403).json({
                success: false,
                message: 'Cette histoire n\'est pas publiée'
            });
        }

        if (!histoire.pageDepart) {
            return res.status(400).json({
                success: false,
                message: 'Cette histoire n\'a pas de page de départ'
            });
        }

        // Incrémenter le compteur
        histoire.nbFoisCommencee += 1;
        await histoire.save();

        res.json({
            success: true,
            data: {
                histoire,
                pageActuelle: histoire.pageDepart
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Obtenir une page spécifique
exports.getPage = async (req, res) => {
    try {
        const page = await Page.findById(req.params.pageId)
            .populate('choix.pageDestination', 'titre');

        if (!page) {
            return res.status(404).json({
                success: false,
                message: 'Page non trouvée'
            });
        }

        res.json({
            success: true,
            data: page
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Enregistrer une partie terminée
exports.terminerPartie = async (req, res) => {
    try {
        const { histoireId, pageFinId, parcours } = req.body;

        const histoire = await Histoire.findById(histoireId);
        const pageFin = await Page.findById(pageFinId);

        if (!histoire || !pageFin) {
            return res.status(404).json({
                success: false,
                message: 'Histoire ou page de fin non trouvée'
            });
        }

        if (!pageFin.statutFin) {
            return res.status(400).json({
                success: false,
                message: 'Cette page n\'est pas une page de fin'
            });
        }

        // Enregistrer la partie
        const partie = new Partie({
            lecteur: req.user._id,
            histoire: histoireId,
            pageFin: pageFinId,
            parcours: parcours || [],
            dateFin: new Date()
        });

        await partie.save();

        // Incrémenter le compteur de parties finies
        histoire.nbFoisFinie += 1;
        await histoire.save();

        res.status(201).json({
            success: true,
            data: partie,
            message: 'Partie enregistrée avec succès'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Obtenir les parties du lecteur
exports.getMesParties = async (req, res) => {
    try {
        const parties = await Partie.find({ lecteur: req.user._id })
            .populate('histoire', 'titre descriptionCourte')
            .populate('pageFin', 'titre texte')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: parties
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Obtenir les statistiques d'une histoire pour le lecteur
exports.getStatistiquesHistoire = async (req, res) => {
    try {
        const histoire = await Histoire.findById(req.params.id);

        if (!histoire) {
            return res.status(404).json({
                success: false,
                message: 'Histoire non trouvée'
            });
        }

        // Compter les parties par page de fin
        const parties = await Partie.find({ histoire: req.params.id })
            .populate('pageFin', 'titre texte');

        const statistiques = {
            nbFoisCommencee: histoire.nbFoisCommencee,
            nbFoisFinie: histoire.nbFoisFinie,
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

        res.json({
            success: true,
            data: statistiques
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
