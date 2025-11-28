const mongoose = require('mongoose');

// Modèle pour sauvegarder automatiquement les parties en cours
const partieEnCoursSchema = new mongoose.Schema({
    lecteur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    histoire: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Histoire',
        required: true
    },
    pageActuelle: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    parcours: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }],
    derniereModification: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index pour retrouver rapidement la partie en cours d'un lecteur pour une histoire
partieEnCoursSchema.index({ lecteur: 1, histoire: 1 }, { unique: true });

const PartieEnCours = mongoose.model('PartieEnCours', partieEnCoursSchema);

module.exports = { PartieEnCours };
