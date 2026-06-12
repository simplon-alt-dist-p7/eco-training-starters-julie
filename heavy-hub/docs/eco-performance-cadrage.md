# Cadrage : Performance, Green IT et Éco-conception — heavy-hub

## Objectif
Définir les principes, les KPI, le périmètre et le protocole de mesure pour réduire l'empreinte numérique du portail `heavy-hub` tout en conservant l'expérience utilisateur.

## Périmètre
- Code front-end : `heavy-hub/frontend/src/*` (principalement `hub.css`, composants React).
- Actifs statiques : images, polices, vidéos, icônes.
- Chargement initial : page d'accueil (`/`), bibliothèque (`/library`) et pages de détail (`/content/:id`).
- Comportement runtime : polling notifications, appels fetch au démarrage.

## Objectifs chiffrés (exemple)
- Réduire la taille du CSS global de 30%.
- Diminuer le First Contentful Paint (FCP) de 10%.
- Réduire le nombre de requêtes initiales de 20%.
- Améliorer l'EcoIndex global de la home de +3 points.

## KPI
- Taille totale des ressources chargées (Ko).
- Nombre de requêtes réseau au premier chargement.
- FCP, LCP, Speed Index (Lighthouse).
- EcoIndex / GES estimé (gCO2e).
- Nombre de règles CSS / sélecteurs (indicateur de complexité).

## Baseline
Se baser sur l'audit initial (`heavy-hub/initial-audit.md`) : utiliser ces résultats comme référence avant/après.

## Outils recommandés
- Google Lighthouse (Chrome DevTools ou CLI)
- EcoIndex ou WebPageTest pour métriques environnementales
- Chrome DevTools Network & Coverage (unused CSS)
- PurgeCSS / unCSS pour analyse (usage avec prudence)
- ImageOptim / Squoosh pour optimisation d'images

## Checklist de bonnes pratiques (priorisées)
1. CSS
   - Regrouper variables et styles partagés (déjà commencé pour les cartes).
   - Supprimer les règles et sélecteurs non utilisés (coverage report).
   - Réduire la spécificité et préférer des classes réutilisables.
   - Éviter les doublons (factoriser bordures/fonds/ombres).
   - Charger le CSS critique inline pour la structure initiale si nécessaire.
2. Images & médias
   - Servir WebP/AVIF quand possible.
   - Redimensionner et fournir images responsives (`srcset`).
   - Lazy-load des images hors-viewport.
3. Fonts
   - Précharger (`preload`) les polices critiques, subset si possible.
   - Préférer `font-display: swap`.
4. JavaScript & appels réseau
   - Décomposer le bundle si nécessaire (code-splitting).
   - Réduire les appels au démarrage : regrouper / retarder / mettre en cache.
   - Allonger l'intervalle de polling des notifications ou utiliser WebSocket si pertinent.
5. Caching
   - Mettre des en-têtes de cache appropriés pour assets statiques.
   - Utiliser snapshot localStorage pour éviter rechargements redondants (déjà en place).
6. Mesures et CI
   - Ajouter tests Lighthouse automatisés (CI) sur la page d'accueil.
   - Mesurer EcoIndex périodiquement.

## Protocole de mesure (procédure simple)
1. Baseline : exécuter Lighthouse et EcoIndex sur la page `/` et `/library` en conditions simulées (mobile et desktop throttling off pour métriques réelles).
2. Enregistrer : scores (Performance, FCP, LCP), taille page (Ko), nombre de requêtes, EcoIndex, GES.
3. Appliquer optimisation(s) (ex : factorisation CSS, suppression des règles inutiles).
4. Re-run : répéter les mêmes tests et comparer.
5. Critère d'acceptation : atteindre objectifs chiffrés définis dans ce document.

## Commandes utiles
- Lighthouse (CLI) :

```bash
npx lighthouse http://localhost:5173/ --output json --output-path=./reports/lh-home.json --preset=desktop
```

- EcoIndex via WebPageTest/EcoIndex CLI (si disponible) ou scripts personnalisés.

- Coverage pour CSS dans Chrome DevTools (manuel) : `Coverage` panel → `Start instrumenting coverage`.

## Plan d'action recommandé
1. Mesurer baseline (Lighthouse + EcoIndex) — 1 jour.
2. CSS : analyser coverage, factoriser règles communes, supprimer duplications — 1–2 jours.
3. Assets : optimiser images et polices — 1 jour.
4. Réduire appels réseau initiaux (regrouper, augmenter caching) — 1 jour.
5. Re-mesurer et itérer.

## Responsabilités
- Développeur Frontend : exécution des étapes, modifications de `hub.css` et optimisation des composants.
- QA / Mesure : lancer Lighthouse/EcoIndex et valider KPI.

## Annexes
- Référence : `heavy-hub/initial-audit.md`
- Fichier principal CSS : `heavy-hub/frontend/src/hub.css`

---
Document créé automatiquement pour servir de cadrage initial. Mises à jour et décisions d'équipe à documenter ici.
