# 🚀 Quick Start Guide

## Démarrage rapide en 5 minutes

### 1️⃣ Prérequis
```powershell
# Vérifier Node.js installé (>= 16)
node --version

# Vérifier MongoDB installé
mongod --version
```

### 2️⃣ Installer les dépendances

**Backend :**
```powershell
cd backend/auth-service
npm install
```

**Frontend :**
```powershell
cd frontend
npm install
```

### 3️⃣ Configuration

Le fichier `.env` existe déjà dans `backend/auth-service/` avec :
- PORT=3000
- MONGODB_URI=mongodb://localhost:27017/histoires-interactives
- JWT_SECRET=votre_secret_jwt

⚠️ **Important** : Changez le JWT_SECRET en production !

### 4️⃣ Démarrer MongoDB

**Option 1 - MongoDB local :**
```powershell
mongod
```

**Option 2 - MongoDB Atlas (cloud) :**
Modifiez `MONGODB_URI` dans `.env` avec votre URL de connexion Atlas.

### 5️⃣ Lancer l'application

**Terminal 1 - Backend :**
```powershell
cd backend/auth-service
npm run dev
```
✅ Backend tourne sur http://localhost:3000

**Terminal 2 - Seed (première fois seulement) :**
```powershell
cd backend/auth-service
node seed.js
```
✅ Données de démo créées

**Terminal 3 - Frontend :**
```powershell
cd frontend
npm run dev
```
✅ Application accessible sur http://localhost:5173

### 6️⃣ Tester l'application

Ouvrez http://localhost:5173 et connectez-vous avec :

**Compte LECTEUR :**
- Email : `charlie@example.com`
- Password : `password123`

**Compte AUTEUR :**
- Email : `alice@example.com`
- Password : `password123`

**Compte ADMIN :**
- Email : `admin@example.com`
- Password : `password123`

## ✅ Checklist de vérification

- [ ] MongoDB démarre sans erreur
- [ ] Backend affiche "Serveur démarré sur le port 3000"
- [ ] Backend affiche "Connecté à MongoDB"
- [ ] Seed affiche "Seed terminé avec succès"
- [ ] Frontend s'ouvre sur http://localhost:5173
- [ ] Je peux me connecter avec un compte de test
- [ ] Je vois les histoires sur la page d'accueil

## 🐛 Problèmes courants

### "ECONNREFUSED 127.0.0.1:27017"
➡️ MongoDB n'est pas démarré. Lancez `mongod` dans un terminal.

### "Port 3000 already in use"
➡️ Un autre processus utilise le port 3000. Changez le PORT dans `.env` ou arrêtez l'autre processus.

### "Cannot GET /api/..."
➡️ Le backend n'est pas démarré. Vérifiez le terminal backend.

### Page blanche sur le frontend
➡️ Vérifiez la console du navigateur (F12). Le frontend ne peut peut-être pas contacter le backend.

### "User not found" lors du login
➡️ Exécutez `node seed.js` pour créer les utilisateurs de test.

## 📚 Prochaines étapes

1. **Tester en tant que LECTEUR** : Lire une histoire interactive
2. **Tester en tant qu'AUTEUR** : Créer votre première histoire
3. **Tester en tant qu'ADMIN** : Gérer les utilisateurs et histoires

Amusez-vous bien ! 🎉
