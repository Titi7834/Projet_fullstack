# Projet Fullstack - Histoires Interactives 📚

Application web fullstack de "livres dont vous êtes le héros" avec trois types d'utilisateurs : LECTEUR, AUTEUR et ADMIN.

## 🎯 Fonctionnalités

### Pour les Lecteurs (LECTEUR)
- ✅ Parcourir les histoires publiées avec recherche par titre/tags
- ✅ Lire des histoires interactives avec choix multiples
- ✅ Suivre sa progression dans chaque histoire
- ✅ Découvrir les différentes fins possibles

### Pour les Auteurs (AUTEUR)
- ✅ Créer et gérer ses propres histoires
- ✅ Éditeur de pages avec système de choix ramifiés
- ✅ Définir plusieurs fins possibles
- ✅ Publier les histoires complètes
- ✅ Voir les statistiques de lecture

### Pour les Administrateurs (ADMIN)
- ✅ Bannir/débannir des utilisateurs
- ✅ Changer les rôles des utilisateurs
- ✅ Suspendre/réactiver des histoires
- ✅ Voir les statistiques globales de la plateforme

## 🛠️ Technologies Utilisées

### Backend
- **Node.js** avec **Express.js** 4.18.2
- **MongoDB** avec **Mongoose** 8.0.0
- **JWT** (jsonwebtoken 9.0.2) pour l'authentification
- **bcryptjs** 2.4.3 pour le hachage des mots de passe
- **CORS** pour les requêtes cross-origin

### Frontend
- **React** 18 avec **Vite** 7.2.4
- **React Router DOM** pour le routing
- **Fetch API** pour les requêtes HTTP
- **Context API** pour la gestion de l'état global

## 📦 Installation

### Prérequis
- Node.js >= 16
- MongoDB installé et lancé localement (ou connexion à MongoDB Atlas)

### 1. Backend

```powershell
cd backend/auth-service
npm install
```

Créer un fichier `.env` dans `backend/auth-service/` :
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/histoires-interactives
JWT_SECRET=votre_secret_jwt_super_securise_ici
```

### 2. Frontend

```powershell
cd frontend
npm install
```

Le fichier `.env` est déjà créé avec :
```env
VITE_API_URL=http://localhost:3000
```

## 🚀 Lancement

### 1. Démarrer MongoDB (si local)
```powershell
mongod
```

### 2. Lancer le Backend
```powershell
cd backend/auth-service
npm run dev
```
Le serveur démarre sur http://localhost:3000

### 3. Peupler la base de données (première fois seulement)
```powershell
cd backend/auth-service
node seed.js
```

Cela crée :
- **4 utilisateurs** :
  - `admin@example.com` / `password123` (ADMIN)
  - `alice@example.com` / `password123` (AUTEUR)
  - `bob@example.com` / `password123` (AUTEUR)
  - `charlie@example.com` / `password123` (LECTEUR)
- **2 histoires publiées** complètes avec plusieurs fins
- **1 histoire en brouillon**

### 4. Lancer le Frontend
```powershell
cd frontend
npm run dev
```
L'application s'ouvre sur http://localhost:5173

## 📱 Utilisation

### Première connexion
1. Ouvrir http://localhost:5173
2. Cliquer sur "Connexion"
3. Utiliser un des comptes de test :
   - **Lecteur** : `charlie@example.com` / `password123`
   - **Auteur** : `alice@example.com` / `password123`
   - **Admin** : `admin@example.com` / `password123`

### Scénarios de test

#### En tant que Lecteur
1. Page d'accueil : voir les histoires publiées
2. Utiliser la barre de recherche pour filtrer
3. Cliquer sur "Commencer l'aventure" sur une histoire
4. Faire des choix pour progresser
5. Atteindre une fin pour terminer la partie

#### En tant qu'Auteur
1. Aller dans "Mes Histoires"
2. Créer une nouvelle histoire
3. Cliquer sur "Éditer" pour créer des pages
4. Ajouter des pages avec des choix
5. Définir une page de départ
6. Publier l'histoire quand elle est complète

#### En tant qu'Admin
1. Aller dans "Administration"
2. Onglet "Statistiques" : voir les chiffres globaux
3. Onglet "Utilisateurs" : bannir/changer les rôles
4. Onglet "Histoires" : suspendre des histoires

## 🗂️ Structure du Projet

```
Projet_Fullstack/
├── backend/
│   └── auth-service/
│       ├── src/
│       │   ├── config/
│       │   │   └── database.js
│       │   ├── controllers/
│       │   │   ├── authController.js
│       │   │   ├── adminController.js
│       │   │   ├── histoireController.js
│       │   │   └── lecteurController.js
│       │   ├── middleware/
│       │   │   └── authMiddleware.js
│       │   ├── model/
│       │   │   ├── user.js
│       │   │   ├── histoire.js
│       │   │   └── lecteur.js
│       │   ├── routes/
│       │   │   ├── authRoutes.js
│       │   │   ├── histoireRoutes.js
│       │   │   ├── lecteurRoutes.js
│       │   │   └── adminRoutes.js
│       │   └── app.js
│       ├── seed.js
│       ├── package.json
│       └── .env
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Layout.jsx
    │   │   ├── Layout.css
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Auth.css
    │   │   ├── Home.jsx
    │   │   ├── Home.css
    │   │   ├── LecteurHistoire.jsx
    │   │   ├── LecteurHistoire.css
    │   │   ├── MesHistoires.jsx
    │   │   ├── MesHistoires.css
    │   │   ├── EditeurHistoire.jsx
    │   │   ├── EditeurHistoire.css
    │   │   ├── AdminDashboard.jsx
    │   │   └── AdminDashboard.css
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── App.css
    │   └── main.jsx
    ├── package.json
    └── .env
```

## 🔐 Sécurité

- Mots de passe hachés avec bcrypt (salt rounds: 10)
- Authentification par JWT avec expiration 24h
- Middleware de vérification des rôles
- Vérification du statut de bannissement à chaque requête protégée
- Validation des autorisations (auteur peut modifier uniquement ses histoires)

## 📊 Modèles de Données

### User
- username, email, password (haché)
- role: LECTEUR | AUTEUR | ADMIN
- statutBanni: boolean

### Histoire
- titre, descriptionCourte, descriptionLongue
- imageCouverture, tags[]
- auteur (ref User)
- statut: brouillon | publiée | suspendue
- pages[] (embedded)
- pageDepart (ref Page)
- statistiques (nbFoisCommencee, nbFoisTerminee)

### Page
- numero, texte
- choix[] { texte, pageDestination }
- statutFin: boolean

### Lecteur & Partie
- Tracking des parties terminées
- Parcours complet (suite de pages visitées)
- Statistiques de complétion

## 🎨 Design

- Thème : Dégradé bleu/violet (#1e3c72 → #2a5298 → #7e22ce)
- Composants avec fond rgba(255, 255, 255, 0.1)
- Badges de statut colorés (vert/rouge/orange)
- Interface responsive (mobile-friendly)

## 🐛 Débogage

### Backend ne démarre pas
- Vérifier que MongoDB est lancé
- Vérifier le fichier `.env` dans `backend/auth-service/`
- Vérifier le port 3000 disponible

### Frontend ne se connecte pas au backend
- Vérifier que le backend tourne sur http://localhost:3000
- Vérifier le fichier `.env` dans `frontend/`
- Vérifier la console navigateur pour les erreurs CORS

### Erreur "User not found" lors du login
- Exécuter `node seed.js` pour créer les utilisateurs de test
- Vérifier que MongoDB contient les données

## 📝 Scripts NPM

### Backend
```powershell
npm run dev    # Démarre le serveur en mode développement
npm start      # Démarre le serveur en mode production
```

### Frontend
```powershell
npm run dev    # Démarre Vite dev server
npm run build  # Build de production
npm run preview # Preview du build
```

## 🚧 Améliorations Futures

- [ ] Upload d'images pour les couvertures
- [ ] Système de notation/commentaires
- [ ] Statistiques détaillées par histoire (graphiques)
- [ ] Éditeur visuel de graphe de pages
- [ ] Export/import d'histoires (JSON)
- [ ] Mode hors ligne (PWA)
- [ ] Notifications en temps réel
- [ ] Traduction multilingue

## 📄 Licence

Projet éducatif - Tous droits réservés

---

**Développé avec ❤️ pour le cours de Fullstack**
