# Initial Audit

## Lighthouse sur home et bibliotheque

| Page                                | Performance | First Content Paint | Largest Contentful Paint | Total Blocking Time | Cumulative Layout Shift | Speed Index | Accessibility | Best Practices | SEO |
|-------------------------------------|-------------|---------------------|--------------------------|---------------------|-------------------------|-------------|---------------|----------------|-----|
| http://localhost:5173/              | 90          | 1.1 s               | 1.9 s                    | 0 ms                | 0                       | 1.1 s       | 94            | 100            | 83  |
| http://localhost:5173/library       | 90          | 1.1 s               | 1.9 s                    | 0 ms                | 0                       | 1.1 s       | 92            | 100            | 83  |
| http://localhost:5173/dashboard     | 89          | 1.1 s               | 1.9 s                    | 0 ms                | 0                       | 1.1 s       | 94            | 100            | 83  |
| http://localhost:5173/notifications | 89          | 1.1 s               | 1.9 s                    | 0 ms                | 0                       | 1.1 s       | 94            | 100            | 82  |
| http://localhost:5173/profile       | 89          | 1.1 s               | 1.9 s                    | 0 ms                | 0                       | 1.1 s       | 94            | 100            | 83  |
| http://localhost:5173/content/content-1                                    | 90          | 1.0 s               | 1.9 s                    | 0 ms                | 0.01                    | 1.0 s       | 91            | 100            | 83  |

## EcoIndex sur home connectee

| Date                | Url                                     | Nombre de requêtes | Taille de la page (Ko) | Taille du DOM | GES (gCO2e) | Eau (cl) | EcoIndex | Note |   |
|---------------------|-----------------------------------------|--------------------|------------------------|---------------|-------------|----------|----------|------|---|
| 11/06/2026 14:34:48 | http://localhost:5173/                  | 27                 | 1764                   | 130           | 1.43        | 2.15     | 78.40    |   B  |   |
| 11/06/2026 14:34:53 | http://localhost:5173/library           | 27                 | 1764                   | 155           | 1.45        | 2.17     | 77.66    |   B  |   |
| 11/06/2026 14:38:52 | http://localhost:5173/dashboard         | 27                 | 1764                   | 122           | 1.43        | 2.14     | 78.64    |   B  |   |
| 11/06/2026 14:39:39 | http://localhost:5173/notifications     | 24                 | 1732                   | 188           | 1.46        | 2.18     | 77.21    |   B  |   |
| 11/06/2026 14:40:30 | http://localhost:5173/profile           | 28                 | 1775                   | 117           | 1.43        | 2.14     | 78.56    |   B  |   |
| 11/06/2026 14:41:24 | http://localhost:5173/content/content-1 | 29                 | 1775                   | 157           | 1.46        | 2.18     | 77.19    |   B  |   |

## Poids medias et snapshots locaux


## Nombre d'appels API au premier chargement
Pour identifier spécifiquement les appels API dans de réseau de l'inspecteur, il faut filtrer par type de ressource (souvent marqué comme **XHR** ou **Fetch**) ou examiner les en-têtes et le contenu de la réponse pour confirmer qu'il s'agit d'un échange de données application plutôt que d'un document web standard.

### Home :
| Name          | Status | Type  | Initiator      | Size   | Time  |
|---------------|--------|-------|----------------|--------|-------|
| home          | 200    | fetch | HubApp.tsx:120 | 5.6 kB | 16 ms |
| library       | 200    | fetch | HubApp.tsx:120 | 9.5 kB | 17 ms |
| dashboard     | 200    | fetch | HubApp.tsx:120 | 4.4 kB | 22 ms |
| notifications | 200    | fetch | HubApp.tsx:120 | 3.1 kB | 20 ms |
| profile       | 200    | fetch | HubApp.tsx:120 | 0.8 kB | 22 ms |
| home          | 200    | fetch | HubApp.tsx:120 | 5.6 kB | 26 ms |
| library       | 200    | fetch | HubApp.tsx:120 | 9.5 kB | 31 ms |
| dashboard     | 200    | fetch | HubApp.tsx:120 | 4.4 kB | 29 ms |
| notifications | 200    | fetch | HubApp.tsx:120 | 3.1 kB | 25 ms |
| profile       | 200    | fetch | HubApp.tsx:120 | 0.8 kB | 32 ms |

### Library
| Name          | Status | Type  | Initiator      | Size   | Time  |
|---------------|--------|-------|----------------|--------|-------|
| home          | 200    | fetch | HubApp.tsx:120 | 5.6 kB | 13 ms |
| library       | 200    | fetch | HubApp.tsx:120 | 9.5 kB | 19 ms |
| dashboard     | 200    | fetch | HubApp.tsx:120 | 4.4 kB | 21 ms |
| notifications | 200    | fetch | HubApp.tsx:120 | 3.1 kB | 23 ms |
| profile       | 200    | fetch | HubApp.tsx:120 | 0.8 kB | 23 ms |
| home          | 200    | fetch | HubApp.tsx:120 | 5.6 kB | 30 ms |
| library       | 200    | fetch | HubApp.tsx:120 | 9.5 kB | 31 ms |
| dashboard     | 200    | fetch | HubApp.tsx:120 | 4.4 kB | 32 ms |
| notifications | 200    | fetch | HubApp.tsx:120 | 3.1 kB | 36 ms |
| profile       | 200    | fetch | HubApp.tsx:120 | 0.8 kB | 38 ms |

### Dashboard
| Name          | Status | Type  | Initiator      | Size   | Time  |
|---------------|--------|-------|----------------|--------|-------|
| home          | 200    | fetch | HubApp.tsx:120 | 5.6 kB | 14 ms |
| library       | 200    | fetch | HubApp.tsx:120 | 9.5 kB | 15 ms |
| dashboard     | 200    | fetch | HubApp.tsx:120 | 4.4 kB | 17 ms |
| notifications | 200    | fetch | HubApp.tsx:120 | 3.1 kB | 19 ms |
| profile       | 200    | fetch | HubApp.tsx:120 | 0.8 kB | 26 ms |
| home          | 200    | fetch | HubApp.tsx:120 | 5.6 kB | 30 ms |
| library       | 200    | fetch | HubApp.tsx:120 | 9.5 kB | 27 ms |
| dashboard     | 200    | fetch | HubApp.tsx:120 | 4.4 kB | 38 ms |
| notifications | 200    | fetch | HubApp.tsx:120 | 3.1 kB | 39 ms |
| profile       | 200    | fetch | HubApp.tsx:120 | 0.8 kB | 40 ms |

### Notifications
NOTE : un nouvel appel "notifications" se génère toutes les 5-6 secondes -> envisager un interval plus long
| Name          | Status | Type  | Initiator      | Size   | Time  |
|---------------|--------|-------|----------------|--------|-------|
| home          | 200    | fetch | HubApp.tsx:120 | 5.6 kB | 15 ms |
| library       | 200    | fetch | HubApp.tsx:120 | 9.5 kB | 20 ms |
| dashboard     | 200    | fetch | HubApp.tsx:120 | 4.4 kB | 23 ms |
| notifications | 200    | fetch | HubApp.tsx:120 | 3.1 kB | 25 ms |
| profile       | 200    | fetch | HubApp.tsx:120 | 0.8 kB | 20 ms |
| home          | 200    | fetch | HubApp.tsx:120 | 5.6 kB | 33 ms |
| library       | 200    | fetch | HubApp.tsx:120 | 9.5 kB | 30 ms |
| dashboard     | 200    | fetch | HubApp.tsx:120 | 4.4 kB | 36 ms |
| notifications | 200    | fetch | HubApp.tsx:120 | 3.1 kB | 36 ms |
| profile       | 200    | fetch | HubApp.tsx:120 | 0.8 kB | 32 ms |

### Profile
| Name          | Status | Type  | Initiator      | Size   | Time  |
|---------------|--------|-------|----------------|--------|-------|
| home          | 200    | fetch | HubApp.tsx:120 | 5.6 kB | 16 ms |
| library       | 200    | fetch | HubApp.tsx:120 | 9.5 kB | 17 ms |
| home          | 200    | fetch | HubApp.tsx:120 | 5.6 kB | 30 ms |
| library       | 200    | fetch | HubApp.tsx:120 | 9.5 kB | 36 ms |
| dashboard     | 200    | fetch | HubApp.tsx:120 | 4.4 kB | 33 ms |
| notifications | 200    | fetch | HubApp.tsx:120 | 3.1 kB | 39 ms |
| profile       | 200    | fetch | HubApp.tsx:120 | 0.8 kB | 41 ms |
| dashboard     | 200    | fetch | HubApp.tsx:120 | 4.4 kB | 17 ms |
| notifications | 200    | fetch | HubApp.tsx:120 | 3.1 kB | 20 ms |
| profile       | 200    | fetch | HubApp.tsx:120 | 0.8 kB | 23 ms |

### content/content-1
NOTE : l'appel du module "content-1" se lance 2 fois (doublon d'appel ?)
| Name          | Status | Type  | Initiator      | Size   | Time  |
|---------------|--------|-------|----------------|--------|-------|
| home          | 200    | fetch | HubApp.tsx:120 | 5.6 kB | 12 ms |
| library       | 200    | fetch | HubApp.tsx:120 | 9.5 kB | 15 ms |
| dashboard     | 200    | fetch | HubApp.tsx:120 | 4.4 kB | 17 ms |
| notifications | 200    | fetch | HubApp.tsx:120 | 3.1 kB | 19 ms |
| profile       | 200    | fetch | HubApp.tsx:120 | 0.8 kB | 21 ms |
| home          | 200    | fetch | HubApp.tsx:120 | 5.6 kB | 21 ms |
| library       | 200    | fetch | HubApp.tsx:120 | 9.5 kB | 25 ms |
| dashboard     | 200    | fetch | HubApp.tsx:120 | 4.4 kB | 34 ms |
| notifications | 200    | fetch | HubApp.tsx:120 | 3.1 kB | 27 ms |
| profile       | 200    | fetch | HubApp.tsx:120 | 0.8 kB | 33 ms |
| content-1     | 200    | fetch | HubApp.tsx:120 | 5.4 kB | 28 ms |
| content-1     | 200    | fetch | HubApp.tsx:120 | 5.4 kB | 28 ms |