# Projet Fullstack - Histoires Interactives 📚

Application web fullstack de "livres dont vous êtes le héros" avec trois types d'utilisateurs : LECTEUR, AUTEUR et ADMIN.

## 🎯 Fonctionnalités

### Pour les Lecteurs (LECTEUR)
- ✅ Parcourir les histoires publiées avec recherche par titre/tags et filtrage par thème
- ✅ Lire des histoires interactives avec choix multiples
- ✅ Système d'auto-sauvegarde automatique (toutes les 30s)
- ✅ Reprendre une partie sauvegardée
- ✅ Découvrir les différentes fins possibles avec statistiques
- ✅ Voir les fins débloquées après complétion
- ✅ Historique complet de toutes les parties terminées ("Mes Lectures")
- ✅ Statistiques de fin : nombre de joueurs ayant atteint chaque fin
- ✅ Noter et commenter les histoires
- ✅ Signaler du contenu inapproprié
- ✅ Mode prévisualisation pour les auteurs

### Pour les Auteurs (AUTEUR)
- ✅ Créer et gérer ses propres histoires
- ✅ Éditeur de pages avec système de choix ramifiés
- ✅ Ajouter des illustrations par URL sur chaque page
- ✅ Définir plusieurs fins possibles avec labels personnalisés
- ✅ Publier les histoires complètes
- ✅ Statistiques avancées :
  - Nombre de lectures et de parties terminées
  - Taux de complétion (% de fins différentes découvertes)
  - Distribution des fins atteintes (avec graphiques en barres)
  - Nombre de parties abandonnées
  - Note moyenne et nombre d'avis
- ✅ Mode prévisualisation pour tester avant publication
- ✅ Gestion des commentaires et avis

### Pour les Administrateurs (ADMIN)
- ✅ Bannir/débannir des utilisateurs
- ✅ Changer les rôles des utilisateurs
- ✅ Suspendre/réactiver des histoires
- ✅ Voir les statistiques globales de la plateforme

## 🆕 Nouvelles Fonctionnalités (Dernière mise à jour)

### Auto-sauvegarde et Reprise
- Sauvegarde automatique de la progression toutes les 30 secondes
- Popup au démarrage pour reprendre une partie en cours
- Nettoyage des sauvegardes après complétion

### Statistiques Avancées
- **Taux de complétion** : Pourcentage des fins uniques découvertes par les joueurs
- **Distribution des fins** : Graphiques montrant combien de joueurs ont atteint chaque fin
- **Fins débloquées** : Liste des fins que chaque joueur a découvertes
- **Statistiques en fin de partie** : Affichage du nombre de joueurs ayant eu la même fin

### Mode Prévisualisation
- Les auteurs peuvent tester leurs histoires sans affecter les statistiques
- Banner distinctif en mode prévisualisation
- Auto-sauvegarde désactivée en mode prévisualisation

### Illustrations
- Ajout d'images par URL sur chaque page
- Affichage responsive des illustrations
- Validation des URLs d'image

### Système de Notation et Commentaires
- Les lecteurs peuvent noter les histoires (1-5 étoiles)
- Ajout de commentaires textuels
- Affichage de la note moyenne et des avis sur chaque histoire
- Visualisation des commentaires en bas de page de lecture

### Signalement de Contenu
- Système de report pour signaler du contenu inapproprié
- Modal de signalement avec choix de raison

### Page "Mes Lectures"
- Historique complet de toutes les parties terminées
- Statistiques personnelles (nombre d'histoires terminées, moyenne de pages)
- Détails de chaque partie (date, fin atteinte, nombre de pages visitées)
- Bouton pour rejouer les histoires

### Interface Utilisateur Améliorée
- **Toasts notifications** : Messages de succès/erreur/avertissement non-intrusifs
- **Modals de confirmation** : Confirmation avant suppression d'histoires
- **Design responsive complet** : Support mobile, tablette et desktop
- **Badges de statut** : Indicateurs visuels pour brouillon/publié/suspendu
- **Graphiques de distribution** : Barres de progression pour les statistiques

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
- **Context API** pour la gestion de l'état global (Auth + Toast)
- **Fetch API** pour les requêtes HTTP
- **CSS3** avec Media Queries pour le responsive

## 📦 Installation

### Prérequis
- Node.js >= 16
- MongoDB installé et lancé localement (ou connexion à MongoDB Atlas)

### 1. Backend

```powershell
cd backend
npm install
```

Créer un fichier `.env` dans `backend/` :
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

### 1.1 Si utilisation de Docker
```powershell
cd backend
docker compose up -d
```

### 2. Lancer le Backend
```powershell
cd backend
npm run dev
```
Le serveur démarre sur http://localhost:3000

### 3. Peupler la base de données (première fois seulement)
```powershell
cd backend
node seed.js
```

Cela crée :
- **4 utilisateurs** :
  - `admin@example.com`/ `admin` / `password123` (ADMIN)
  - `alice@example.com` / `auteur_alice` / `password123` (AUTEUR)
  - `bob@example.com` / `auteur_bob` / `password123` (AUTEUR)
  - `charlie@example.com` / `lecteur_charlie` / `password123` (LECTEUR)
- **2 histoires publiées** complètes avec plusieurs fins :
  - **"La Prophétie du Dragon d'Émeraude"** : Fantasy épique, 15 pages, 8 fins différentes
  - **"Le Laboratoire Oublié - Projet Pandora"** : Sci-Fi éthique, 12 pages, 7 fins différentes
- **1 histoire en brouillon**

Les histoires contiennent des embranchements complexes avec plusieurs chemins et conséquences.

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
1. Page d'accueil : voir les histoires publiées avec filtres par thème
2. Utiliser la barre de recherche pour filtrer par titre/tags
3. Cliquer sur "Commencer l'aventure" sur une histoire
4. Si une partie est en cours, choisir "Reprendre" ou "Recommencer"
5. Faire des choix pour progresser (auto-sauvegarde toutes les 30s)
6. Atteindre une fin pour terminer la partie et voir les statistiques
7. Noter et commenter l'histoire après l'avoir terminée
8. Consulter "Mes Lectures" pour voir l'historique de toutes les parties finies

#### En tant qu'Auteur
1. Aller dans "Mes Histoires"
2. Créer une nouvelle histoire avec titre, description, thème
3. Cliquer sur "Éditer" pour créer des pages
4. Ajouter des pages avec texte, image (URL optionnelle) et choix
5. Définir des fins avec labels personnalisés (ex: "Fin Héroïque")
6. Définir une page de départ
7. Utiliser "Prévisualiser" pour tester l'histoire sans affecter les stats
8. Publier l'histoire quand elle est complète
9. Consulter les statistiques avancées (taux de complétion, distribution des fins)

#### En tant qu'Admin
1. Aller dans "Administration"
2. Onglet "Statistiques" : voir les chiffres globaux
3. Onglet "Utilisateurs" : bannir/changer les rôles
4. Onglet "Histoires" : suspendre des histoires

## 🗂️ Structure du Projet

```
Projet_Fullstack/
├── backend/
│   ├──src/
│   |   ├── config/
│   |   │   └── database.js
│   |   ├── controllers/
│   |   │   ├── authController.js
│   |   │   ├── adminController.js
│   |   │   ├── histoireController.js
│   |   │   └── lecteurController.js
│   |   ├── middleware/
│   |   |   └── authMiddleware.js
│   |   ├── model/
│   |   │   ├── user.js
│   |   │   ├── histoire.js
│   |   │   └── lecteur.js
│   |   ├── routes/
│   |   │   ├── authRoutes.js
│   |   │   ├── histoireRoutes.js
│   |   │   ├── lecteurRoutes.js
│   |   │   └── adminRoutes.js
│   |   └── app.js
│   ├── seed.js
│   ├── package.json
│   └── .env
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
    │   │   ├── MesLectures.jsx
    │   │   ├── MesLectures.css
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
- imageCouverture, tags[], theme
- auteur (ref User)
- statut: brouillon | publiée | suspendue
- pages[] (embedded) avec imageUrl optionnelle
- pageDepart (ref Page)
- statistiques:
  - nbFoisCommencee (nombre de parties commencées)
  - nbFoisTerminee (nombre de parties finies)
  - finsAtteintes[] (liste des fins découvertes par les joueurs)
  - nbFoisAbandon (nombre de parties abandonnées)
  - notesMoyenne (moyenne des notes)
  - nbAvis (nombre d'avis)
- avis[] { userId, note (1-5), commentaire, date }

### Page
- numero, titre, texte, imageUrl (optionnelle)
- choix[] { texte, pageDestination }
- statutFin: boolean
- labelFin (pour les fins, ex: "Fin Héroïque")

### Lecteur & Partie
- Tracking des parties terminées avec pageFin
- Parcours complet (suite de pages visitées)
- Auto-sauvegarde à chaque choix
- Statistiques de complétion par joueur

## 🎨 Design

- Thème : Dégradé bleu/violet (#1e3c72 → #2a5298 → #7e22ce)
- Composants avec fond rgba(255, 255, 255, 0.1)
- Badges de statut colorés (vert/rouge/orange)
- Interface responsive (mobile-friendly)

## 🐛 Débogage

### Backend ne démarre pas
- Vérifier que MongoDB est lancé
- Vérifier le fichier `.env` dans `backend/`
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

- [ ] Upload d'images pour les couvertures (actuellement via URL uniquement)
- [ ] Éditeur visuel de graphe de pages
- [ ] Export/import d'histoires (JSON)
- [ ] Mode hors ligne (PWA)
- [ ] Notifications en temps réel
- [ ] Traduction multilingue
- [ ] Système de badges/achievements pour les lecteurs
- [ ] Générateur de PDF pour imprimer les histoires

## 📄 Licence

Projet éducatif - Tous droits réservés

---

**Développé avec ❤️ pour le cours de Fullstack**
