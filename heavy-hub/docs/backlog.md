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

## User story 4

- Contexte: En tant que **Développeur Frontend**, je veux **transformer chaque contenu une seule fois et réutiliser le résultat**, afin de **limiter le travail répété lors de l’affichage des différentes pages**.
- Objectif: Centraliser les transformations des contenus dans le mapper existant et éviter de décorer à nouveau les mêmes éléments pour la bibliothèque, l’accueil, le suivi et les contenus associés.
- Bonne pratique d eco-conception ciblee: Effectuer les transformations à l’entrée des données ou les mettre en cache au niveau approprié; ne pas recalculer sans mesure démontrant un bénéfice.
- KPI associe: Nombre d’appels de transformation par contenu et par chargement, durée cumulée des transformations (ms), temps de rendu des listes.
- Repo ou ecran concerne: heavy-hub/frontend/src/utils/contentMappers.ts, heavy-hub/frontend/src/HubApp.tsx, heavy-hub/frontend/src/app/HubApp.tsx, pages Accueil, Bibliothèque, Suivi et détail contenu.
- Critere de reussite: Chaque contenu reçu est transformé au plus une fois par chargement de données, le résultat est réutilisé par les pages concernées et les libellés affichés restent identiques. Une mesure avant/après confirme le nombre d’appels et la durée des transformations.
- Niveau de priorite: haute

## User story 5

- Contexte: En tant qu’**Utilisateur**, je veux **que la mise à jour d’une information ne relance pas le rendu des écrans qui ne la consultent pas**, afin de **conserver une navigation fluide**.
- Objectif: Séparer le chargement des données, l’état partagé et la définition des routes, puis limiter la propagation des mises à jour aux composants concernés.
- Bonne pratique d eco-conception ciblee: Définir des responsabilités et des frontières d’état adaptées; éviter les mises à jour globales et les rendus coûteux sans mesure préalable.
- KPI associe: Nombre de composants rendus lors d’une mise à jour des notifications, durée de rendu mesurée avec React Profiler, nombre d’états gérés par le composant racine.
- Repo ou ecran concerne: heavy-hub/frontend/src/HubApp.tsx, heavy-hub/frontend/src/app/HubApp.tsx et composants de pages et de navigation.
- Critere de reussite: Une mise à jour des notifications actualise les éléments qui les affichent sans relancer le rendu des pages sans lien avec ces données; le chargement des données est séparé du composant qui déclare les routes. Le comportement est vérifié avec React Profiler avant/après.
- Niveau de priorite: moyenne

## User story 6

- Contexte: En tant qu’**Utilisateur**, je veux **voir un état de chargement, une erreur ou un contenu indisponible clairement identifié**, afin de **ne pas confondre des données anciennes avec le résultat demandé**.
- Objectif: Fiabiliser les chargements initiaux et ceux des détails de contenu, empêcher les réponses obsolètes d’écraser les données récentes et distinguer les états de chargement, d’erreur et d’absence de résultat.
- Bonne pratique d eco-conception ciblee: Annuler les requêtes devenues inutiles avec AbortController, nettoyer les effets asynchrones et éviter de conserver ou de recalculer des données périmées.
- KPI associe: Nombre de requêtes obsolètes encore actives après changement d’écran ou d’identifiant, taux de réponses tardives appliquées, couverture des états de chargement et d’erreur.
- Repo ou ecran concerne: heavy-hub/frontend/src/HubApp.tsx, heavy-hub/frontend/src/app/HubApp.tsx, écran Content et appels de heavy-hub/frontend/src/services/hubService.ts.
- Critere de reussite: Lors d’un changement rapide d’identifiant, seul le contenu correspondant au dernier identifiant est affiché; les requêtes obsolètes sont annulées; les erreurs et l’absence de contenu ont des états explicites; les chargements initiaux affichent une erreur exploitable en cas d’échec.
- Niveau de priorite: haute

## User story 7

- Contexte: En tant qu’**Utilisateur**, je veux **parcourir la bibliothèque sans attendre le rendu de toute une grande liste**, afin de **trouver rapidement une ressource**.
- Objectif: Mesurer le coût de rendu des listes sur un jeu de données représentatif et afficher progressivement les grands volumes par pagination ou virtualisation si les mesures le justifient.
- Bonne pratique d eco-conception ciblee: Éviter les mémorisations systématiques; profiler les calculs et les rendus, puis privilégier la réduction du nombre d’éléments affichés avant d’ajouter des optimisations de références.
- KPI associe: Durée de rendu de la liste (ms), nombre d’éléments présents dans le DOM, temps avant affichage des premiers résultats, nombre de mémorisations ajoutées.
- Repo ou ecran concerne: heavy-hub/frontend/src/HubApp.tsx et heavy-hub/frontend/src/pages/LibraryPage.tsx (filtres et affichage de la bibliothèque).
- Critere de reussite: Un profilage sur un volume représentatif est consigné avant toute optimisation; au-delà du seuil de volume défini à partir de ce profilage, la liste est paginée ou virtualisée et le nombre d’éléments montés est limité. Toute mémorisation ajoutée répond à un coût mesuré et est justifiée par une comparaison avant/après.
- Niveau de priorite: moyenne

## Notes

- Vous pouvez ajouter d autres user stories si necessaire.
- Le niveau de detail attendu doit permettre une priorisation exploitable.
