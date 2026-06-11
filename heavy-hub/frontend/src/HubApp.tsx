import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Route, Routes, useParams } from 'react-router-dom';

type RawContentItem = {
  id: string;
  title: string;
  format: string;
  level: string;
  duration: number;
  heroAsset: string;
  teaser: string;
  body: string;
  modules: Array<{ title: string; progress: number; attachmentCount: number }>;
  attachments: Array<{ name: string; kind: string }>;
};
type DisplayContentItem = Omit<RawContentItem, 'modules' | 'attachments'> & {
  track: string;
  modules: Array<{ title: string; progress: number; attachmentCount: number }>;
  attachments: Array<{ name: string; kind: string }>;
};
type RawContentDetail = RawContentItem & { related: RawContentItem[] };
type DisplayContentDetail = DisplayContentItem & { related: DisplayContentItem[] };
type HomePayload = { title: string; subtitle: string; featured: RawContentItem[] };
type NotificationItem = { id: string; title: string; level: string; createdAt: string; read: boolean; context: string };
type NotificationsPayload = { items: Array<{ id: string; title: string; level: string; createdAt: string; read: boolean }> };
type ProfilePayload = { name: string; role: string; location: string; avatar: string; badges: string[]; recentHistory: string[] };
type DashboardPayload = { enrolled: number; completed: number; streak: number; pendingActions: number; focus: RawContentItem[] };

const CONTENT_PRESETS = [
  {
    title: 'Onboarding des relais terrain',
    teaser: 'Une base de reference pour accueillir un nouveau partenaire, clarifier le cadre et transmettre les bons supports.',
    body: 'Ce parcours rassemble le cadrage initial, les modules essentiels et les ressources a partager au demarrage afin de rendre les relais rapidement autonomes.',
    track: 'Coordination'
  },
  {
    title: 'Guide de moderation des ateliers',
    teaser: 'Des reperes pour animer une session, cadrer les temps collectifs et capitaliser les decisions prises en atelier.',
    body: 'Le contenu structure la moderation avant, pendant et apres la session avec un fil clair pour l animation, la documentation et la restitution.',
    track: 'Animation'
  },
  {
    title: 'Playbook de pilotage local',
    teaser: 'Un support transverse pour orchestrer les sujets de terrain, les arbitrages et les points de contact regionaux.',
    body: 'Cette ressource aide a suivre les jalons, preparer les arbitrages et centraliser les signaux remontes par les equipes locales.',
    track: 'Pilotage'
  },
  {
    title: 'Sequence de lancement de parcours',
    teaser: 'Une trame de lancement avec messages, supports et checklist pour mettre en route un nouveau cycle.',
    body: 'Le detail du parcours met en avant les livrables de cadrage, les rendez-vous de lancement et les pieces utiles a diffuser au bon moment.',
    track: 'Activation'
  },
  {
    title: 'Trame de suivi des cohortes',
    teaser: 'Un point d appui pour suivre l avancement d un groupe, prioriser les relances et partager la bonne lecture des progressions.',
    body: 'Cette ressource donne un cadre simple pour suivre les cohortes, qualifier les risques et relayer les demandes d aide sans perte de contexte.',
    track: 'Suivi'
  },
  {
    title: 'Atelier d arbitrage editorial',
    teaser: 'Un format d atelier pour relire les arbitrages, statuer sur les priorites et preparer la diffusion des decisions.',
    body: 'Le contenu organise la sequence d arbitrage, les points de validation et les documents a partager apres la session.',
    track: 'Editorial'
  },
  {
    title: 'Capsule de restitution equipe',
    teaser: 'Une ressource courte pour diffuser les points saillants d un cycle, les resultats observes et les suites a donner.',
    body: 'La capsule facilite la mise en commun des resultats, la synthese des enseignements et le transfert des messages clefs vers les equipes.',
    track: 'Restitution'
  },
  {
    title: 'Fiche reflexe coordination terrain',
    teaser: 'Un format concis pour retrouver rapidement les gestes a appliquer lors d une remontée de terrain ou d une bascule urgente.',
    body: 'La fiche s appuie sur des reperes courts, des contacts utiles et des pieces deja pretes a transmettre selon la situation.',
    track: 'Support'
  },
  {
    title: 'Kit d accompagnement des relais',
    teaser: 'Une boite a outils pour outiller les referents, harmoniser les pratiques et diffuser les versions a jour des supports.',
    body: 'Le kit centralise les documents, les checklists et les supports recurrents pour garantir une base commune a l ensemble du reseau.',
    track: 'Ressources'
  }
] as const;

const MODULE_PRESETS: Record<string, string[]> = {
  video: ['Introduction', 'Visionnage guide', 'Temps d analyse', 'Synthese', 'Plan d action'],
  fiche: ['Vue d ensemble', 'Checklist', 'Points de vigilance', 'Cas terrain', 'A retenir'],
  atelier: ['Preparation', 'Animation', 'Simulation', 'Debrief', 'Capitalisation']
};

const ATTACHMENT_LABELS = ['Brief de session', 'Support d animation', 'Modele de cadrage', 'Replay', 'Trame de restitution'];

const NOTIFICATION_LABELS = [
  'Une session live a ete replanifiee',
  'Un commentaire a ete ajoute sur votre parcours',
  'La synthese hebdomadaire est disponible',
  'Un nouveau support a ete publie',
  'Une validation reste en attente',
  'Le kit de coordination a ete mis a jour'
];

const NOTIFICATION_CONTEXTS = [
  'A revoir avant le prochain point d equipe.',
  'Partage recommande avec les referents concernes.',
  'Un complement de lecture est disponible dans la bibliotheque.',
  'Le contenu associe peut etre ouvert directement depuis le hub.'
];

const PROFILE_HISTORY = [
  'Relu la synthese de lancement du cycle partenaires',
  'Partage le guide de moderation avec le pool animation',
  'Valide une mise a jour de la trame de suivi',
  'Consulte les messages de coordination terrain',
  'Repris le playbook de pilotage local',
  'Ajoute un commentaire sur la derniere capsule de restitution'
];

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Echec sur ' + url);
  }
  return response.json() as Promise<T>;
}

function contentIndex(id: string) {
  const value = Number(id.split('-')[1]);
  return Number.isFinite(value) ? Math.max(value - 1, 0) : 0;
}

function decorateContent(item: RawContentItem): DisplayContentItem {
  const preset = CONTENT_PRESETS[contentIndex(item.id) % CONTENT_PRESETS.length];
  const moduleLabels = MODULE_PRESETS[item.format] ?? MODULE_PRESETS.fiche;

  return {
    ...item,
    title: preset.title,
    teaser: preset.teaser,
    body: preset.body,
    track: preset.track,
    modules: item.modules.map((module, index) => ({
      ...module,
      title: moduleLabels[index] ?? module.title
    })),
    attachments: item.attachments.map((attachment, index) => ({
      ...attachment,
      name: ATTACHMENT_LABELS[index] ?? attachment.name
    }))
  };
}

function decorateDetail(item: RawContentDetail): DisplayContentDetail {
  const current = decorateContent(item);
  return {
    ...current,
    related: item.related.map(decorateContent)
  };
}

function decorateNotifications(payload: NotificationsPayload): NotificationItem[] {
  return payload.items.map((item, index) => ({
    ...item,
    title: NOTIFICATION_LABELS[index % NOTIFICATION_LABELS.length],
    context: NOTIFICATION_CONTEXTS[index % NOTIFICATION_CONTEXTS.length]
  }));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value));
}

function formatDuration(value: number) {
  return value + ' min';
}

function averageProgress(item: DisplayContentItem) {
  if (item.modules.length === 0) {
    return 0;
  }
  return Math.round(item.modules.reduce((total, module) => total + module.progress, 0) / item.modules.length);
}

function PortalHeader({ unreadCount }: { unreadCount: number }) {
  return (
    <header className="hub-header">
      <div className="hub-branding">
        <span className="hub-eyebrow">Portail membre</span>
        <div>
          <strong>Connexions</strong>
          <p>Bibliotheque, suivi et coordination des parcours dans un seul espace de travail.</p>
        </div>
      </div>
      <div className="hub-header-side">
        <nav className="hub-nav">
          <NavLink to="/" end>
            Accueil
          </NavLink>
          <NavLink to="/library">Bibliotheque</NavLink>
          <NavLink to="/dashboard">Suivi</NavLink>
          <NavLink to="/notifications">Messages</NavLink>
          <NavLink to="/profile">Profil</NavLink>
        </nav>
        <span className="hub-header-chip">{unreadCount} non lu(s)</span>
      </div>
    </header>
  );
}

function ContentCard({ item, compact = false }: { item: DisplayContentItem; compact?: boolean }) {
  return (
    <article className={compact ? 'hub-content-card compact' : 'hub-content-card'}>
      <img src={item.heroAsset} alt={item.title} />
      <div className="hub-card-copy">
        <div className="hub-meta-row">
          <span>{item.track}</span>
          <span>{item.level}</span>
          <span>{formatDuration(item.duration)}</span>
        </div>
        <h3>{item.title}</h3>
        <p>{item.teaser}</p>
        <div className="hub-card-footer">
          <strong>{averageProgress(item)}%</strong>
          <Link to={'/content/' + item.id}>Ouvrir</Link>
        </div>
      </div>
    </article>
  );
}

function HomePage({
  home,
  featured,
  dashboard,
  notifications
}: {
  home: HomePayload;
  featured: DisplayContentItem[];
  dashboard: DashboardPayload;
  notifications: NotificationItem[];
}) {
  const unread = notifications.filter((item) => !item.read).slice(0, 3);

  return (
    <div className="hub-stack">
      <section className="hub-hero">
        <div className="hub-hero-copy">
          <p className="hub-eyebrow">Accueil connecte</p>
          <h1>{home.title}</h1>
          <p>{home.subtitle}</p>
          <div className="hub-chip-row">
            <span>{dashboard.enrolled} contenus</span>
            <span>{dashboard.completed} parcours finalises</span>
            <span>{dashboard.pendingActions} actions a traiter</span>
          </div>
        </div>
        <aside className="hub-focus-panel">
          <div className="hub-panel-header">
            <p className="hub-eyebrow">A suivre</p>
            <h2>Points de vigilance</h2>
          </div>
          <div className="hub-message-list">
            {unread.map((item) => (
              <article key={item.id} className="hub-message-card">
                <strong>{item.title}</strong>
                <p>{item.context}</p>
                <small>{formatDate(item.createdAt)}</small>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <section className="hub-summary-grid">
        <article className="hub-summary-card">
          <span>Serie en cours</span>
          <strong>{dashboard.streak} jours</strong>
        </article>
        <article className="hub-summary-card">
          <span>Progression moyenne</span>
          <strong>{averageProgress(featured[0] ?? decorateContent(home.featured[0]))}%</strong>
        </article>
        <article className="hub-summary-card">
          <span>Messages en attente</span>
          <strong>{notifications.filter((item) => !item.read).length}</strong>
        </article>
      </section>

      <section className="hub-section">
        <div className="hub-panel-header">
          <div>
            <p className="hub-eyebrow">Selection</p>
            <h2>Ressources mises en avant</h2>
          </div>
        </div>
        <div className="hub-card-grid">
          {featured.map((item) => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}

function LibraryPage({ items }: { items: DisplayContentItem[] }) {
  const [formatFilter, setFormatFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');

  const formats = useMemo(() => Array.from(new Set(items.map((item) => item.format))), [items]);
  const levels = useMemo(() => Array.from(new Set(items.map((item) => item.level))), [items]);

  const visible = useMemo(() => {
    return items.filter((item) => {
      if (formatFilter && item.format !== formatFilter) {
        return false;
      }
      if (levelFilter && item.level !== levelFilter) {
        return false;
      }
      return true;
    });
  }, [items, formatFilter, levelFilter]);

  return (
    <section className="hub-library-layout">
      <aside className="hub-filter-panel">
        <p className="hub-eyebrow">Bibliotheque</p>
        <h1>Ressources disponibles</h1>
        <p>Filtrez les contenus par format ou niveau pour retrouver plus vite le bon support.</p>

        <div className="hub-filter-block">
          <strong>Formats</strong>
          <div className="hub-filter-chips">
            <button type="button" className={formatFilter === '' ? 'active' : ''} onClick={() => setFormatFilter('')}>
              Tous
            </button>
            {formats.map((format) => (
              <button
                key={format}
                type="button"
                className={formatFilter === format ? 'active' : ''}
                onClick={() => setFormatFilter(format)}
              >
                {format}
              </button>
            ))}
          </div>
        </div>

        <div className="hub-filter-block">
          <strong>Niveaux</strong>
          <div className="hub-filter-chips">
            <button type="button" className={levelFilter === '' ? 'active' : ''} onClick={() => setLevelFilter('')}>
              Tous
            </button>
            {levels.map((level) => (
              <button
                key={level}
                type="button"
                className={levelFilter === level ? 'active' : ''}
                onClick={() => setLevelFilter(level)}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <div className="hub-library-grid">
        {visible.map((item) => (
          <ContentCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

function ContentPage({ items }: { items: DisplayContentItem[] }) {
  const { id } = useParams();
  const [detail, setDetail] = useState<DisplayContentDetail | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    fetchJson<RawContentDetail>('/api/content/' + id)
      .then((payload) => setDetail(decorateDetail(payload)))
      .catch(() => setDetail(null));
  }, [id]);

  const fallback = items.find((item) => item.id === id) ?? items[0];
  const current = detail ?? (fallback ? { ...fallback, related: items.slice(0, 3) } : null);

  if (!current) {
    return <main className="hub-stack"><p>Contenu indisponible.</p></main>;
  }

  return (
    <div className="hub-stack">
      <section className="hub-detail-hero">
        <img src={current.heroAsset} alt={current.title} />
        <article className="hub-detail-card">
          <p className="hub-eyebrow">Detail du contenu</p>
          <h1>{current.title}</h1>
          <p>{current.body}</p>
          <div className="hub-chip-row">
            <span>{current.track}</span>
            <span>{current.format}</span>
            <span>{current.level}</span>
            <span>{formatDuration(current.duration)}</span>
          </div>
        </article>
      </section>

      <section className="hub-detail-grid">
        <article className="hub-panel">
          <div className="hub-panel-header">
            <div>
              <p className="hub-eyebrow">Progression</p>
              <h2>Modules du parcours</h2>
            </div>
          </div>
          <div className="hub-module-list">
            {current.modules.map((module) => (
              <div key={module.title} className="hub-module-row">
                <div>
                  <strong>{module.title}</strong>
                  <small>{module.attachmentCount} piece(s) associee(s)</small>
                </div>
                <div className="hub-progress-track">
                  <span style={{ width: module.progress + '%' }} />
                </div>
                <strong>{module.progress}%</strong>
              </div>
            ))}
          </div>
        </article>

        <aside className="hub-side-stack">
          <article className="hub-panel">
            <div className="hub-panel-header">
              <div>
                <p className="hub-eyebrow">Pieces jointes</p>
                <h2>Supports disponibles</h2>
              </div>
            </div>
            <div className="hub-attachment-list">
              {current.attachments.map((attachment) => (
                <div key={attachment.name + attachment.kind} className="hub-attachment-row">
                  <strong>{attachment.name}</strong>
                  <span>{attachment.kind}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="hub-panel">
            <div className="hub-panel-header">
              <div>
                <p className="hub-eyebrow">Associes</p>
                <h2>Ressources liees</h2>
              </div>
            </div>
            <div className="hub-related-list">
              {current.related.map((item) => (
                <ContentCard key={item.id} item={item} compact />
              ))}
            </div>
          </article>
        </aside>
      </section>
    </div>
  );
}

function DashboardPage({
  dashboard,
  focus,
  profile
}: {
  dashboard: DashboardPayload;
  focus: DisplayContentItem[];
  profile: ProfilePayload;
}) {
  return (
    <div className="hub-stack">
      <section className="hub-summary-grid">
        <article className="hub-summary-card">
          <span>Parcours suivis</span>
          <strong>{dashboard.enrolled}</strong>
        </article>
        <article className="hub-summary-card">
          <span>Parcours completes</span>
          <strong>{dashboard.completed}</strong>
        </article>
        <article className="hub-summary-card">
          <span>Actions a traiter</span>
          <strong>{dashboard.pendingActions}</strong>
        </article>
      </section>

      <section className="hub-dashboard-grid">
        <article className="hub-panel">
          <div className="hub-panel-header">
            <div>
              <p className="hub-eyebrow">A reprendre</p>
              <h2>Focus de la semaine</h2>
            </div>
          </div>
          <div className="hub-card-grid compact-grid">
            {focus.map((item) => (
              <ContentCard key={item.id} item={item} compact />
            ))}
          </div>
        </article>

        <article className="hub-panel hub-profile-panel">
          <div className="hub-panel-header">
            <div>
              <p className="hub-eyebrow">Repere personnel</p>
              <h2>{profile.name}</h2>
            </div>
          </div>
          <p>{profile.role} · {profile.location}</p>
          <div className="hub-badge-row">
            {profile.badges.map((badge) => (
              <span key={badge}>{badge}</span>
            ))}
          </div>
          <div className="hub-activity-list">
            {PROFILE_HISTORY.map((entry) => (
              <div key={entry} className="hub-activity-row">
                <strong>{entry}</strong>
                <small>Tracee dans l historique personnel</small>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}

function NotificationsPage({ notifications, refresh }: { notifications: NotificationItem[]; refresh: () => void }) {
  useEffect(() => {
    const timer = window.setInterval(refresh, 7000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  const unread = notifications.filter((item) => !item.read).length;
  const priority = notifications.filter((item) => item.level === 'high').length;

  return (
    <div className="hub-stack">
      <section className="hub-summary-grid">
        <article className="hub-summary-card">
          <span>Messages non lus</span>
          <strong>{unread}</strong>
        </article>
        <article className="hub-summary-card">
          <span>Priorites hautes</span>
          <strong>{priority}</strong>
        </article>
        <article className="hub-summary-card">
          <span>Total</span>
          <strong>{notifications.length}</strong>
        </article>
      </section>

      <section className="hub-panel">
        <div className="hub-panel-header">
          <div>
            <p className="hub-eyebrow">Messages</p>
            <h2>Fil d activite</h2>
          </div>
        </div>
        <div className="hub-notification-list">
          {notifications.map((item) => (
            <article key={item.id} className={item.read ? 'hub-notification-card read' : 'hub-notification-card'}>
              <div className="hub-card-header">
                <strong>{item.title}</strong>
                <span>{item.level}</span>
              </div>
              <p>{item.context}</p>
              <small>{formatDate(item.createdAt)}</small>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function ProfilePage({ profile, items }: { profile: ProfilePayload; items: DisplayContentItem[] }) {
  return (
    <div className="hub-stack">
      <section className="hub-profile-layout">
        <article className="hub-panel hub-profile-hero">
          <img src={profile.avatar} alt={profile.name} />
          <div>
            <p className="hub-eyebrow">Profil</p>
            <h1>{profile.name}</h1>
            <p>{profile.role} · {profile.location}</p>
            <div className="hub-badge-row">
              {profile.badges.map((badge) => (
                <span key={badge}>{badge}</span>
              ))}
            </div>
          </div>
        </article>

        <article className="hub-panel">
          <div className="hub-panel-header">
            <div>
              <p className="hub-eyebrow">Historique recent</p>
              <h2>Dernieres actions</h2>
            </div>
          </div>
          <div className="hub-activity-list">
            {(profile.recentHistory.length > 0 ? profile.recentHistory : PROFILE_HISTORY).slice(0, 6).map((entry, index) => (
              <div key={entry + index} className="hub-activity-row">
                <strong>{PROFILE_HISTORY[index] ?? entry}</strong>
                <small>Conserve dans votre espace personnel</small>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="hub-section">
        <div className="hub-panel-header">
          <div>
            <p className="hub-eyebrow">Pour vous</p>
            <h2>Ressources recommandees</h2>
          </div>
        </div>
        <div className="hub-card-grid compact-grid">
          {items.slice(0, 4).map((item) => (
            <ContentCard key={item.id} item={item} compact />
          ))}
        </div>
      </section>
    </div>
  );
}

export default function HubApp() {
  const [home, setHome] = useState<HomePayload | null>(null);
  const [library, setLibrary] = useState<DisplayContentItem[]>([]);
  const [dashboard, setDashboard] = useState<DashboardPayload | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [profile, setProfile] = useState<ProfilePayload | null>(null);

  const refreshNotifications = () => {
    fetchJson<NotificationsPayload>('/api/notifications').then((payload) => {
      setNotifications(decorateNotifications(payload));
    });
  };

  useEffect(() => {
    Promise.all([
      fetchJson<HomePayload>('/api/home'),
      fetchJson<RawContentItem[]>('/api/library'),
      fetchJson<DashboardPayload>('/api/dashboard'),
      fetchJson<NotificationsPayload>('/api/notifications'),
      fetchJson<ProfilePayload>('/api/profile')
    ]).then(([homePayload, libraryPayload, dashboardPayload, notificationsPayload, profilePayload]) => {
      setHome(homePayload);
      setLibrary(libraryPayload.map(decorateContent));
      setDashboard(dashboardPayload);
      setNotifications(decorateNotifications(notificationsPayload));
      setProfile(profilePayload);
      window.localStorage.setItem(
        'hub-snapshot',
        JSON.stringify({ homePayload, libraryPayload, dashboardPayload, notificationsPayload, profilePayload })
      );
    });
  }, []);

  const focusItems = useMemo(() => {
    return dashboard ? dashboard.focus.map(decorateContent) : [];
  }, [dashboard]);

  const featuredItems = useMemo(() => {
    return home ? home.featured.map(decorateContent) : [];
  }, [home]);

  if (!home || !dashboard || !profile) {
    return <main className="hub-loading-shell"><p>Chargement de votre portail...</p></main>;
  }

  return (
    <div className="hub-app">
      <PortalHeader unreadCount={notifications.filter((item) => !item.read).length} />
      <main className="hub-main">
        <Routes>
          <Route
            path="/"
            element={<HomePage home={home} featured={featuredItems} dashboard={dashboard} notifications={notifications} />}
          />
          <Route path="/library" element={<LibraryPage items={library} />} />
          <Route path="/content/:id" element={<ContentPage items={library} />} />
          <Route path="/dashboard" element={<DashboardPage dashboard={dashboard} focus={focusItems} profile={profile} />} />
          <Route path="/notifications" element={<NotificationsPage notifications={notifications} refresh={refreshNotifications} />} />
          <Route path="/profile" element={<ProfilePage profile={profile} items={library} />} />
        </Routes>
      </main>
    </div>
  );
}
