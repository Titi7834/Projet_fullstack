# Guide du Responsive Design

## Points de rupture (Breakpoints)

Le projet utilise trois breakpoints principaux pour assurer une expérience optimale sur tous les appareils :

### 📱 Mobile (≤ 480px)
- Petits smartphones
- Navigation simplifiée en colonne
- Boutons pleine largeur
- Textes et espacements réduits
- Touch targets minimum 44x44px

### 📱 Tablet (481px - 768px)
- Tablettes et grands smartphones
- Mise en page hybride
- Grilles adaptatives (2 colonnes)
- Navigation flexible

### 💻 Desktop (> 768px)
- Ordinateurs et grands écrans
- Mise en page complète
- Grilles multi-colonnes
- Tous les espacements normaux

## Améliorations implémentées

### ✅ Navigation (Layout.css)
- Header en colonne sur mobile
- Navigation wrappable
- Footer empilé verticalement
- Touch targets augmentés

### ✅ Pages principales

#### Home.css
- Hero en colonne avec texte centré
- Cards 1 colonne sur mobile
- Filtres empilés verticalement
- Boutons pleine largeur

#### LecteurHistoire.css
- Images limitées à 200-250px sur mobile
- Texte plus petit mais lisible
- Choix empilés verticalement
- Commentaires optimisés
- Bannière preview adaptée

#### MesHistoires.css
- Stats en grille 2x2 puis 1 colonne
- Boutons actions wrappables
- Modal stats responsive
- Distribution bars adaptatives

#### MesLectures.css
- Stats overview en grille 2 colonnes puis 1 colonne
- Cards lecture empilées verticalement
- Images d'histoire responsive (max 120px mobile)
- Boutons "Rejouer" pleine largeur sur mobile
- Détails de partie (pages visitées, fin) en colonne

#### EditeurHistoire.css
- Grille pages 1 colonne
- Actions empilées
- Modal large optimisé
- Formulaires pleine largeur

### ✅ Composants

#### Toast.css
- Positionnement optimisé (5px marges mobile)
- Taille texte réduite
- Icônes proportionnelles

#### ConfirmModal.css
- Boutons empilés verticalement
- Largeur 90% puis 100%
- Textes réduits

#### RatingModal.css & ReportModal.css
- Étoiles centrées et plus petites
- Formulaires optimisés
- Actions en colonne sur mobile

#### Auth.css
- Cards 100% largeur mobile
- Inputs avec bon padding
- Textes et titres réduits

### ✅ Utilitaires globaux (App.css)
- Overflow-x hidden
- Touch targets 44x44px minimum
- Font-size adaptatif (14px tablet, 13px mobile)

## Tests recommandés

### Chrome DevTools
1. Ouvrir DevTools (F12)
2. Toggle Device Toolbar (Ctrl+Shift+M)
3. Tester ces résolutions :
   - iPhone SE (375x667)
   - iPhone 12 Pro (390x844)
   - iPad (768x1024)
   - iPad Pro (1024x1366)

### Firefox Responsive Design Mode
1. Ouvrir DevTools (F12)
2. Toggle Responsive Design Mode (Ctrl+Shift+M)
3. Tester rotations portrait/landscape

## Bonnes pratiques appliquées

✅ Mobile-first approach pour les nouveaux composants
✅ Touch targets minimum 44x44px (recommandation Apple/Google)
✅ Textes lisibles (minimum 13px sur mobile)
✅ Images responsive avec max-width: 100%
✅ Modals adaptées à la hauteur d'écran (max-height: 90vh)
✅ Boutons pleine largeur sur mobile pour faciliter le tap
✅ Grilles CSS Grid avec auto-fit pour adaptation automatique
✅ Flexbox avec wrap pour éviter débordements
✅ Espacement réduit progressivement (2rem → 1rem → 0.5rem)

## Optimisations futures possibles

- [ ] Lazy loading des images
- [ ] Service Worker pour offline
- [ ] Touch gestures (swipe) pour navigation
- [ ] Dark mode toggle
- [ ] Animations réduites sur mobile (prefers-reduced-motion)
- [ ] Font loading optimisé
