# Backlog heavy-hub

## Contexte du projet

Le projet represente un portail membre avec home connectee, bibliotheque, detail contenu, dashboard, notifications et profil.

## Format attendu

Completer au minimum 3 user stories.
Remplacer chaque champ entre crochets par votre contenu.

## User story 1

- Contexte: En tant que **Développeur Frontend**, je veux **Optimiser le CSS**, afin de **Alléger le fichier hub.css**.
- Objectif: Réduire la taille du fichier CSS d'au moins 30% et améliorer le First Contentful Paint (FCP) de ~10% sur la page d'accueil.
- Bonne pratique d'eco-conception ciblee: Regrouper règles, supprimer duplications, réutiliser variables CSS et réduire la spécificité inutile.
- KPI associe: Taille du CSS (Ko), FCP (ms), nombre de règles CSS et nombre de sélecteurs.
- Repo ou ecran concerne: heavy-hub/frontend/src/hub.css — pages: Home, Library, Content, Dashboard, Profile.
- Critere de reussite: Taille du CSS réduite ≥30% et FCP amélioré ≥10% mesurés avant/après sur une page représentative.
- Niveau de priorite: haute

## User story 2

- Contexte: En tant que **Utilisateur**, je veux **Avoir accès à un thème sombre**, afin d’**améliorer mon confort visuel et, sur les écrans compatibles, de réduire la consommation d’énergie de l’écran**.
- Objectif: Permettre à l’utilisateur de choisir un thème sombre lisible sur toutes les pages du portail et mémoriser ce choix entre ses visites. Limiter l’impact technique en réutilisant les variables CSS existantes, sans dépendance ni requête réseau supplémentaire. Le gain énergétique éventuel dépend de l’écran utilisé, notamment de la technologie OLED.
- Bonne pratique d eco-conception ciblee: Centraliser les couleurs dans des variables CSS réutilisables, éviter les styles dupliqués et appliquer le thème côté client sans charger de ressource supplémentaire.
- KPI associe: Couverture des pages par le thème sombre (100 %), conservation du choix après rechargement (oui/non), contraste conforme WCAG AA (au moins 4,5:1 pour le texte courant et 3:1 pour le grand texte), nombre de requêtes réseau ajoutées (0).
- Repo ou ecran concerne: heavy-hub/frontend/src/components/PortalHeader.tsx (commande de bascule), heavy-hub/frontend/src/app/HubApp.tsx (état et persistance du thème), heavy-hub/frontend/src/hub.css (variables et styles des thèmes).
- Critere de reussite: L’utilisateur peut activer et désactiver le thème depuis l’en-tête; le thème s’applique sans perte de lisibilité à toutes les pages et est conservé après rechargement; les contrastes respectent WCAG AA; aucune requête réseau ni dépendance supplémentaire n’est introduite.
- Niveau de priorite: moyenne

## User story 3

- Contexte: En tant qu’**Utilisateur**, je veux **que seules les données nécessaires à mon écran soient chargées et que les messages ne soient actualisés que lorsque c’est utile**, afin de **réduire l’attente et les échanges réseau superflus**.
- Objectif: Mesurer les appels actuels, éviter les chargements et rafraîchissements déclenchés inutilement, stabiliser le rafraîchissement des notifications et mutualiser les données réutilisées entre les pages.
- Bonne pratique d eco-conception ciblee: Charger les données au plus près de leur usage, dédupliquer les requêtes, réutiliser un cache en mémoire adapté et nettoyer les temporisateurs quand l’écran concerné est quitté.
- KPI associe: Nombre de requêtes API par écran et par navigation, nombre de requêtes dupliquées, nombre de rafraîchissements de notifications hors de leur écran, volume de données transférées.
- Repo ou ecran concerne: heavy-hub/frontend/src/HubApp.tsx et heavy-hub/frontend/src/app/HubApp.tsx (chargement et orchestration), heavy-hub/frontend/src/services/hubService.ts (appels API), écran Notifications.
- Critere de reussite: Aucun rendu ne réinitialise ou ne duplique le temporisateur de notifications; aucun rafraîchissement n’est effectué lorsque l’écran Notifications est quitté; les écrans ne chargent que les données nécessaires et les navigations réutilisent les données déjà disponibles lorsqu’elles sont encore valides. Une comparaison avant/après documente les requêtes par écran.
- Niveau de priorite: haute

## Notes

- Vous pouvez ajouter d autres user stories si necessaire.
- Le niveau de detail attendu doit permettre une priorisation exploitable.
