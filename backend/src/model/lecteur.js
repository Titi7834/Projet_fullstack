const mongoose = require('mongoose');

const lecteurSchema = new mongoose.Schema({
    utilisateur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'L\'utilisateur est obligatoire']
    },
    histoiresCommencees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Histoire'
    }],
    histoiresFinies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Histoire'
    }],
    statistiques: {
        totalPartiesJouees: {
            type: Number,
            default: 0,
            min: 0
        },
        totalPartiesTerminees: {
            type: Number,
            default: 0,
            min: 0
        }
    }
}, {
    timestamps: true
});

// Enregistrement d'une partie jouée
const partieSchema = new mongoose.Schema({
    lecteur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Le lecteur est obligatoire']
    },
    histoire: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Histoire',
        required: [true, 'L\'histoire est obligatoire']
    },
    pageFin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Page',
        required: [true, 'La page de fin est obligatoire']
    },
    parcours: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Page'
    }],
    dateDebut: {
        type: Date,
        default: Date.now
    },
    dateFin: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Lecteur = mongoose.model('Lecteur', lecteurSchema);
const Partie = mongoose.model('Partie', partieSchema);

module.exports = { Lecteur, Partie };
