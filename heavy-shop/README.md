# heavy-shop

## Contexte pedagogique

Repo miroir pedagogique d un e-commerce / catalogue. Il expose trop d images, des payloads produits verbeux, des filtres qui sollicitent beaucoup le backend et des composants front chargeant toute la logique au demarrage.

Ce projet est volontairement fonctionnel mais non optimise. Il sert de support d analyse et d experimentation dans un cadre de formation.

## Perimetre fonctionnel

- Accueil boutique
- Listing produits
- Fiche produit
- Recherche / filtres
- Panier
- Checkout simplifie

## Anti-patterns presents

- trop d images lourdes
- payload produit surcharge
- filtres qui declenchent trop de requetes
- polling de stock ou promo
- carrousels multiples
- duplication de donnees
- absence de cache
- chargement JS global

## Lancement

`npm install`

`npm run dev`

Frontend: http://localhost:5173

Backend: http://localhost:4100

## Mesure et outillage

- Lighthouse sur accueil boutique et recherche
- EcoIndex sur listing produits
- poids des visuels et JS
- nombre de requetes declenchees par les filtres

### Commandes utiles

- `npm run analyze`
- `npm run lighthouse`
- Lighthouse dans le navigateur Chrome
- EcoIndex via l'extension ou le site dedie
