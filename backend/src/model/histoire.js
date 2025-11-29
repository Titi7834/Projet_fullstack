const mongoose = require('mongoose');

// Schéma pour les choix dans une page
const choixSchema = new mongoose.Schema({
    texte: {
        type: String,
        required: [true, 'Le texte du choix est obligatoire'],
        trim: true
    },
    idPageChoix: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'L\'ID de la page de destination est obligatoire']
    }
}, { _id: true });

// Schéma pour les pages (embarqué dans Histoire)
const pageSchema = new mongoose.Schema({
    histoireReliee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Histoire'
    },
    titre: {
        type: String,
        trim: true,
        maxlength: [200, 'Le titre de la page ne peut pas dépasser 200 caractères']
    },
    texte: {
        type: String,
        required: [true, 'Le texte de la page est obligatoire'],
        trim: true
    },
    imageUrl: {
        type: String,
        trim: true,
        validate: {
            validator: function(v) {
                if (!v) return true; // Optional field
                return /^https?:\/\/.+/.test(v); // Must be a valid URL if provided
            },
            message: 'L\'URL de l\'image doit être valide'
        }
    },
    statutFin: {
        type: Boolean,
        default: false
    },
    labelFin: {
        type: String,
        trim: true,
        maxlength: [100, 'Le label de fin ne peut pas dépasser 100 caractères']
    },
    choix: [choixSchema]
}, { _id: true, timestamps: true });

// Schéma pour les commentaires
const commentaireSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    commentaire: {
        type: String,
        trim: true,
        maxlength: [1000, 'Le commentaire ne peut pas dépasser 1000 caractères']
    },
    note: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    }
}, { _id: true, timestamps: true });

// Schéma principal Histoire
const histoireSchema = new mongoose.Schema({
    titre: {
        type: String,
        required: [true, 'Le titre est obligatoire'],
        trim: true,
        maxlength: [200, 'Le titre ne peut pas dépasser 200 caractères']
    },
    descriptionCourte: {
        type: String,
        required: [true, 'La description courte est obligatoire'],
        trim: true,
        maxlength: [500, 'La description ne peut pas dépasser 500 caractères']
    },
    tags: [{
        type: String,
        trim: true
    }],
    statut: {
        type: String,
        enum: ['brouillon', 'publiée', 'suspendue'],
        default: 'brouillon'
    },
    pageDepart: {
        type: mongoose.Schema.Types.ObjectId
    },
    auteur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'L\'auteur est obligatoire']
    },
    pages: [pageSchema],
    statistiques: {
        nbFoisCommencee: {
            type: Number,
            default: 0,
            min: 0
        },
        nbFoisFinie: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    theme: {
        type: String,
        trim: true
    },
    signalements: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        raison: String,
        date: {
            type: Date,
            default: Date.now
        }
    }],
    commentaires: [commentaireSchema]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Calculer la note moyenne
histoireSchema.virtual('noteMoyenne').get(function() {
    if (!this.commentaires || this.commentaires.length === 0) return 0;
    const notesValides = this.commentaires.filter(c => c.note).map(c => c.note);
    if (notesValides.length === 0) return 0;
    const sum = notesValides.reduce((acc, note) => acc + note, 0);
    return Math.round((sum / notesValides.length) * 10) / 10;
});

// Index pour la recherche
histoireSchema.index({ titre: 'text', descriptionCourte: 'text', tags: 'text' });

const Histoire = mongoose.model('Histoire', histoireSchema);

module.exports = { Histoire };
