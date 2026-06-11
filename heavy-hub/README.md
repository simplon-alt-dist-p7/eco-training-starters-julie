# heavy-hub

## Contexte pedagogique

Repo miroir pedagogique d une plateforme de contenu / espace membre / portail. Il sert a etudier la sobriete de navigation, la limitation du prechargement et la reduction des appels API inutiles dans un espace connecte.

Ce projet est volontairement fonctionnel mais non optimise. Il sert de support d analyse et d experimentation dans un cadre de formation.

## Perimetre fonctionnel

- Home connectee
- Bibliotheque de contenus
- Fiche contenu
- Dashboard utilisateur
- Notifications
- Profil

## Anti-patterns presents

- medias lourds
- contenus precharges inutilement
- avatars non optimises
- notifications bavardes
- prefetch excessif
- duplication de composants
- appels inutiles au chargement
- stockage local superflu

## Lancement

`npm install`

`npm run dev`

Frontend: http://localhost:5173

Backend: http://localhost:4100

## Mesure et outillage

- Lighthouse sur home et bibliotheque
- EcoIndex sur home connectee
- poids medias et snapshots locaux
- nombre d appels API au premier chargement

### Commandes utiles

- `npm run analyze`
- `npm run lighthouse`
- Lighthouse dans le navigateur Chrome
- EcoIndex via l'extension ou le site dedie
