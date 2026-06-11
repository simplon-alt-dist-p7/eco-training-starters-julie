# heavy-showcase

## Contexte pedagogique

Repo miroir pedagogique d un site vitrine / media / institutionnel. Il sert a observer les effets d images lourdes, de medias autoplay, de scripts tiers simules et d une hierarchie d information surchargee.

Ce projet est volontairement fonctionnel mais non optimise. Il sert de support d analyse et d experimentation dans un cadre de formation.

## Perimetre fonctionnel

- Accueil
- A propos
- Actualites / articles
- Contact

## Anti-patterns presents

- images lourdes non optimisees
- video autoplay
- polices et blocs visuels multiples
- scripts tiers simules
- carrousel inutile
- bundle front surdimensionne
- absence de lazy loading
- analytics bavards

## Lancement

`npm install`

`npm run dev`

Frontend: http://localhost:5173

Backend: http://localhost:4100

## Mesure et outillage

- Lighthouse sur accueil et actualites
- EcoIndex sur l accueil
- poids des assets et nombre de requetes
- observation de l accessibilite et de la hierarchie de contenu

### Commandes utiles

- `npm run analyze`
- `npm run lighthouse`
- Lighthouse dans le navigateur Chrome
- EcoIndex via l'extension ou le site dedie
