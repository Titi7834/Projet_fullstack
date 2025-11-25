require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const histoireRoutes = require('./routes/histoireRoutes');
const lecteurRoutes = require('./routes/lecteurRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { authMiddleware } = require('./middleware/authMiddleware');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route de santé
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        service: 'auth-service',
        timestamp: new Date().toISOString()
    });
});

// Routes publiques
app.use('/auth', authRoutes);
app.use('/lecteur', lecteurRoutes);

// Routes protégées
app.use('/api', authMiddleware, protectedRoutes);
app.use('/auteur', histoireRoutes);
app.use('/admin', adminRoutes);

// Gestion des erreurs (middleware d'erreur)
app.use((err, req, res, next) => {
    console.error('Erreur:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Erreur interne du serveur'
    });
});

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await connectDB();
        
        app.listen(PORT, () => {
            console.log(`Serveur auth-service démarré au port ${PORT}`);
        });
    } catch (error) {
        console.error('Erreur au démarrage du serveur:', error);
        process.exit(1);
    }
}

startServer();

module.exports = app;