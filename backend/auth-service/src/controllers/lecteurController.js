const { Histoire } = require('../model/histoire');
const { Partie } = require('../model/lecteur');
const { PartieEnCours } = require('../model/partieEnCours');

// Obtenir toutes les histoires publiées avec recherche et filtre par thème
exports.getHistoiresPubliees = async (req, res) => {
    try {
        const { search, theme } = req.query;
        
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

        // Trouver la page de départ dans les pages embarquées
        const pageDepart = histoire.pages.id(histoire.pageDepart);

        if (!pageDepart) {
            return res.status(400).json({
                success: false,
                message: 'Page de départ non trouvée'
            });
        }

        // Incrémenter le compteur
        histoire.statistiques.nbFoisCommencee += 1;
        await histoire.save();

        res.json({
            success: true,
            data: {
                histoire,
                pageActuelle: pageDepart
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
        const { histoireId, pageId } = req.params;
        
        const histoire = await Histoire.findById(histoireId);

        if (!histoire) {
            return res.status(404).json({
                success: false,
                message: 'Histoire non trouvée'
            });
        }

        const page = histoire.pages.id(pageId);

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

        if (!histoire) {
            return res.status(404).json({
                success: false,
                message: 'Histoire non trouvée'
            });
        }

        const pageFin = histoire.pages.id(pageFinId);

        if (!pageFin) {
            return res.status(404).json({
                success: false,
                message: 'Page de fin non trouvée'
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

        // Supprimer la partie en cours si elle existe
        await PartieEnCours.deleteOne({
            lecteur: req.user._id,
            histoire: histoireId
        });

        // Incrémenter le compteur de parties finies
        histoire.statistiques.nbFoisFinie += 1;
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


exports.getHistoireById = async (req, res) => {
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

// Noter et commenter une histoire
exports.noterHistoire = async (req, res) => {
    try {
        const { note, commentaire } = req.body;
        const histoireId = req.params.id;

        if (!note || note < 1 || note > 5) {
            return res.status(400).json({
                success: false,
                message: 'La note doit être entre 1 et 5'
            });
        }

        const histoire = await Histoire.findById(histoireId);

        if (!histoire) {
            return res.status(404).json({
                success: false,
                message: 'Histoire non trouvée'
            });
        }

        // Vérifier si l'utilisateur a déjà noté
        const existingComment = histoire.commentaires.find(
            c => c.userId.toString() === req.user._id.toString()
        );

        if (existingComment) {
            // Mettre à jour la note/commentaire existant
            existingComment.note = note;
            existingComment.commentaire = commentaire || existingComment.commentaire;
        } else {
            // Ajouter nouveau commentaire
            histoire.commentaires.push({
                userId: req.user._id,
                note,
                commentaire
            });
        }

        await histoire.save();

        res.json({
            success: true,
            message: 'Votre avis a été enregistré',
            data: {
                noteMoyenne: histoire.noteMoyenne,
                nbVotes: histoire.commentaires.length
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Signaler une histoire
exports.signalerHistoire = async (req, res) => {
    try {
        const { raison } = req.body;
        const histoireId = req.params.id;

        if (!raison || raison.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'La raison du signalement est obligatoire'
            });
        }

        const histoire = await Histoire.findById(histoireId);

        if (!histoire) {
            return res.status(404).json({
                success: false,
                message: 'Histoire non trouvée'
            });
        }

        // Vérifier si l'utilisateur a déjà signalé cette histoire
        const existingSignalement = histoire.signalements.find(
            s => s.userId.toString() === req.user._id.toString()
        );

        if (existingSignalement) {
            return res.status(400).json({
                success: false,
                message: 'Vous avez déjà signalé cette histoire'
            });
        }

        histoire.signalements.push({
            userId: req.user._id,
            raison,
            date: new Date()
        });

        await histoire.save();

        res.json({
            success: true,
            message: 'Signalement enregistré avec succès'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Sauvegarder la progression (sauvegarde automatique)
exports.sauvegarderProgression = async (req, res) => {
    try {
        const { histoireId, pageActuelle, parcours } = req.body;

        await PartieEnCours.findOneAndUpdate(
            { lecteur: req.user._id, histoire: histoireId },
            {
                pageActuelle,
                parcours,
                derniereModification: new Date()
            },
            { upsert: true, new: true }
        );

        res.json({
            success: true,
            message: 'Progression sauvegardée'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Reprendre une partie en cours
exports.reprendrePartie = async (req, res) => {
    try {
        const histoireId = req.params.id;

        const partieEnCours = await PartieEnCours.findOne({
            lecteur: req.user._id,
            histoire: histoireId
        });

        if (!partieEnCours) {
            return res.status(404).json({
                success: false,
                message: 'Aucune partie en cours trouvée'
            });
        }

        const histoire = await Histoire.findById(histoireId)
            .populate('auteur', 'username');

        if (!histoire) {
            return res.status(404).json({
                success: false,
                message: 'Histoire non trouvée'
            });
        }

        const pageActuelle = histoire.pages.id(partieEnCours.pageActuelle);

        res.json({
            success: true,
            data: {
                histoire,
                pageActuelle,
                parcours: partieEnCours.parcours
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Obtenir les fins débloquées par l'utilisateur pour une histoire
exports.getFinsDebloquees = async (req, res) => {
    try {
        const histoireId = req.params.id;

        const parties = await Partie.find({
            lecteur: req.user._id,
            histoire: histoireId
        });

        const histoire = await Histoire.findById(histoireId);

        if (!histoire) {
            return res.status(404).json({
                success: false,
                message: 'Histoire non trouvée'
            });
        }

        // Récupérer toutes les fins uniques atteintes
        const finsDebloquees = [];
        const finIdsVus = new Set();

        parties.forEach(partie => {
            const finId = partie.pageFin.toString();
            if (!finIdsVus.has(finId)) {
                finIdsVus.add(finId);
                const pageFin = histoire.pages.id(finId);
                if (pageFin && pageFin.statutFin) {
                    finsDebloquees.push({
                        _id: pageFin._id,
                        labelFin: pageFin.labelFin || 'Fin sans nom',
                        texte: pageFin.texte,
                        dateDebloquage: partie.dateFin
                    });
                }
            }
        });

        // Compter le nombre total de fins possibles
        const totalFins = histoire.pages.filter(p => p.statutFin).length;

        res.json({
            success: true,
            data: {
                finsDebloquees,
                totalFins,
                progression: totalFins > 0 ? Math.round((finsDebloquees.length / totalFins) * 100) : 0
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Obtenir les statistiques de parcours d'une partie
exports.getStatistiquesParcours = async (req, res) => {
    try {
        const { histoireId, parcours } = req.body;

        // Récupérer toutes les parties terminées pour cette histoire
        const toutesLesParties = await Partie.find({ histoire: histoireId });

        if (toutesLesParties.length === 0) {
            return res.json({
                success: true,
                data: {
                    similarite: 0,
                    message: 'Vous êtes le premier à terminer cette histoire !'
                }
            });
        }

        // Calculer la similarité du parcours
        let sommeSimilarites = 0;

        toutesLesParties.forEach(partie => {
            const parcoursAutre = partie.parcours.map(p => p.toString());
            const parcoursActuel = parcours.map(p => p.toString());
            
            // Calculer le pourcentage de pages communes
            const pagesCommunes = parcoursActuel.filter(p => parcoursAutre.includes(p)).length;
            const similarite = (pagesCommunes / Math.max(parcoursActuel.length, parcoursAutre.length)) * 100;
            
            sommeSimilarites += similarite;
        });

        const similariteMoyenne = Math.round(sommeSimilarites / toutesLesParties.length);

        res.json({
            success: true,
            data: {
                similarite: similariteMoyenne,
                message: `Vous avez pris le même chemin que ${similariteMoyenne}% des joueurs`
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};