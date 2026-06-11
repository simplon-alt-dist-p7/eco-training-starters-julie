import { useEffect, useState } from 'react';
import { Link, NavLink, Route, Routes } from 'react-router-dom';

type Metric = { label: string; value: string };
type Office = { city: string; phone: string; email: string };
type Article = {
  id: number;
  slug: string;
  title: string;
  category: string;
  author: string;
  publishedAt: string;
  excerpt: string;
  heroAsset: string;
  bodySections: Array<{ heading: string; content: string }>;
  tags: string[];
  mediaGallery: string[];
};
type ArticleDetail = Article & {
  analytics?: {
    impressions: number;
    readRatio: number;
    partnerMentions: string[];
  };
};
type SitePayload = {
  hero: { title: string; subtitle: string; videoUrl: string };
  metrics: Metric[];
  offices: Office[];
  partners: string[];
  highlights: string[];
  articles: Article[];
};

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Echec sur ' + url);
  }
  return response.json() as Promise<T>;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(value));
}

function Masthead() {
  return (
    <header className="showcase-masthead">
      <div className="showcase-branding">
        <span className="showcase-kicker">Edition territoriale</span>
        <div>
          <strong>Collectif Horizon</strong>
          <p>Actualites, rendez-vous et ressources d'un reseau culturel et climatique.</p>
        </div>
      </div>
      <nav className="showcase-nav">
        <NavLink to="/">Accueil</NavLink>
        <NavLink to="/about">A propos</NavLink>
        <NavLink to="/news">Actualites</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </nav>
    </header>
  );
}

function MetricBoard({ items }: { items: Metric[] }) {
  return (
    <section className="showcase-metric-board">
      {items.map((item) => (
        <article key={item.label} className="showcase-metric-card">
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </article>
      ))}
    </section>
  );
}

function HomePage({ site, articles }: { site: SitePayload; articles: Article[] }) {
  const lead = articles[0];
  const secondary = articles.slice(1, 4);

  useEffect(() => {
    const timer = window.setInterval(() => {
      fetch('/api/analytics/beacon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'hero-video', screen: 'home', sentAt: Date.now() })
      }).catch(() => undefined);
    }, 4000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="showcase-stack">
      <section className="showcase-hero">
        <div className="showcase-hero-copy">
          <p className="showcase-eyebrow">A la une</p>
          <h1>{site.hero.title}</h1>
          <p>{site.hero.subtitle}</p>
          <div className="showcase-actions">
            <Link to="/news" className="showcase-button primary">Voir le fil d'actualite</Link>
            <Link to="/contact" className="showcase-button secondary">Nous contacter</Link>
          </div>
        </div>
        <div className="showcase-hero-media">
          <video autoPlay muted loop playsInline poster="/assets/showcase-hero-1.svg" controls>
            <source src={site.hero.videoUrl} type="video/mp4" />
          </video>
        </div>
      </section>

      <MetricBoard items={site.metrics} />

      {lead ? (
        <section className="showcase-editorial-grid">
          <article className="showcase-lead-story">
            <img src={lead.heroAsset} alt={lead.title} />
            <div className="showcase-lead-copy">
              <p className="showcase-eyebrow">Edition du moment</p>
              <h2>{lead.title}</h2>
              <p>{lead.excerpt}</p>
              <div className="showcase-meta-row">
                <span>{lead.category}</span>
                <span>{formatDate(lead.publishedAt)}</span>
                <span>{lead.author}</span>
              </div>
              <Link to="/news" className="showcase-inline-link">Lire l'article</Link>
            </div>
          </article>

          <aside className="showcase-headline-column">
            <div className="showcase-panel-header">
              <p className="showcase-eyebrow">Chroniques</p>
              <h3>Dernieres publications</h3>
            </div>
            {secondary.map((article) => (
              <article key={article.slug} className="showcase-headline-card">
                <span>{article.category}</span>
                <strong>{article.title}</strong>
                <p>{article.excerpt}</p>
              </article>
            ))}
          </aside>
        </section>
      ) : null}

      <section className="showcase-columns">
        <article className="showcase-agenda">
          <div className="showcase-panel-header">
            <p className="showcase-eyebrow">Agenda</p>
            <h3>Rendez-vous a venir</h3>
          </div>
          {site.highlights.map((item, index) => (
            <div key={item} className="showcase-agenda-row">
              <strong>{String(index + 1).padStart(2, '0')}</strong>
              <div>
                <span>{item}</span>
                <p>Programme public, publication ou rencontre prevue dans le reseau du collectif.</p>
              </div>
            </div>
          ))}
        </article>

        <article className="showcase-partners">
          <div className="showcase-panel-header">
            <p className="showcase-eyebrow">Partenaires</p>
            <h3>Structures associees</h3>
          </div>
          <div className="showcase-logo-grid">
            {site.partners.concat(site.partners).map((partner, index) => (
              <span key={partner + '-' + index}>{partner}</span>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}

function AboutPage({ site }: { site: SitePayload }) {
  return (
    <div className="showcase-stack">
      <section className="showcase-page-grid">
        <article className="showcase-story-panel">
          <p className="showcase-eyebrow">Positionnement</p>
          <h1>A propos du collectif</h1>
          <p>
            Le collectif coordonne une programmation annuelle entre lieux culturels, acteurs publics et initiatives locales.
            Les publications, campagnes et rendez-vous sont centralises dans un meme espace editorial.
          </p>
          <ul className="showcase-bullet-list">
            {site.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <aside className="showcase-aside-media">
          <img src="/assets/showcase-hero-2.svg" alt="Mosaic institutionnelle" />
        </aside>
      </section>

      <section className="showcase-columns">
        <article className="showcase-story-panel">
          <p className="showcase-eyebrow">Implantations</p>
          <h3>Presences locales</h3>
          <div className="showcase-office-list">
            {site.offices.map((office) => (
              <div key={office.city} className="showcase-office-card">
                <strong>{office.city}</strong>
                <span>{office.phone}</span>
                <span>{office.email}</span>
              </div>
            ))}
          </div>
        </article>
        <article className="showcase-story-panel">
          <p className="showcase-eyebrow">Diffusion</p>
          <h3>Points de contact</h3>
          <MetricBoard items={site.metrics} />
        </article>
      </section>
    </div>
  );
}

function NewsPage({ articles }: { articles: Article[] }) {
  const [selectedSlug, setSelectedSlug] = useState(articles[0]?.slug ?? '');
  const [detail, setDetail] = useState<ArticleDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedSlug) {
      return;
    }

    setLoading(true);
    fetchJson<ArticleDetail>('/api/articles/' + selectedSlug)
      .then(setDetail)
      .finally(() => setLoading(false));
  }, [selectedSlug]);

  return (
    <section className="showcase-newsroom">
      <aside className="showcase-news-feed">
        <div className="showcase-panel-header">
          <p className="showcase-eyebrow">Redaction</p>
          <h1>Fil d'actualite</h1>
        </div>
        {articles.map((article) => (
          <button
            key={article.slug}
            type="button"
            className={article.slug === selectedSlug ? 'showcase-feed-item active' : 'showcase-feed-item'}
            onClick={() => setSelectedSlug(article.slug)}
          >
            <span>{article.category}</span>
            <strong>{article.title}</strong>
            <small>{formatDate(article.publishedAt)}</small>
          </button>
        ))}
      </aside>

      <article className="showcase-article-viewer">
        {loading || !detail ? (
          <p>Chargement de l'article...</p>
        ) : (
          <>
            <img src={detail.heroAsset} alt={detail.title} className="showcase-article-hero" />
            <div className="showcase-article-header">
              <p className="showcase-eyebrow">{detail.category}</p>
              <h2>{detail.title}</h2>
              <div className="showcase-meta-row">
                <span>{detail.author}</span>
                <span>{formatDate(detail.publishedAt)}</span>
                <span>{detail.analytics?.impressions ?? 0} lectures</span>
              </div>
            </div>
            <div className="showcase-tag-row">
              {detail.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <div className="showcase-article-body">
              {detail.bodySections.map((section) => (
                <section key={section.heading}>
                  <h3>{section.heading}</h3>
                  <p>{section.content}</p>
                </section>
              ))}
            </div>
            <section className="showcase-media-gallery">
              {detail.mediaGallery.map((asset) => (
                <img key={asset} src={asset} alt={detail.title} />
              ))}
            </section>
          </>
        )}
      </article>
    </section>
  );
}

function ContactPage({ site }: { site: SitePayload }) {
  return (
    <div className="showcase-stack">
      <section className="showcase-page-grid">
        <article className="showcase-story-panel">
          <p className="showcase-eyebrow">Contact</p>
          <h1>Parler avec l'equipe</h1>
          <p>
            Retrouvez les contacts regionaux, les correspondants presse et les structures associees pour vos demandes.
          </p>
          <div className="showcase-office-list">
            {site.offices.map((office) => (
              <div key={office.city} className="showcase-office-card">
                <strong>{office.city}</strong>
                <span>{office.phone}</span>
                <span>{office.email}</span>
              </div>
            ))}
          </div>
        </article>
        <aside className="showcase-aside-media">
          <img src="/assets/showcase-hero-3.svg" alt="Affiche contact" />
        </aside>
      </section>

      <article className="showcase-story-panel">
        <div className="showcase-panel-header">
          <p className="showcase-eyebrow">Annuaire</p>
          <h3>Organisations partenaires</h3>
        </div>
        <div className="showcase-logo-grid">
          {site.partners.map((partner) => (
            <span key={partner}>{partner}</span>
          ))}
        </div>
      </article>
    </div>
  );
}

export default function ShowcaseApp() {
  const [site, setSite] = useState<SitePayload | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetchJson<SitePayload>('/api/site'),
      fetchJson<Article[]>('/api/articles')
    ])
      .then(([sitePayload, articlePayload]) => {
        setSite(sitePayload);
        setArticles(articlePayload);
      })
      .catch((loadError) => {
        setError(loadError instanceof Error ? loadError.message : 'Erreur inconnue');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <main className="showcase-app"><p className="showcase-loading">Chargement de l'edition...</p></main>;
  }

  if (!site || error) {
    return <main className="showcase-app"><p className="showcase-loading">{error ?? 'Le backend n a pas repondu.'}</p></main>;
  }

  return (
    <div className="showcase-app">
      <Masthead />
      <Routes>
        <Route path="/" element={<HomePage site={site} articles={articles} />} />
        <Route path="/about" element={<AboutPage site={site} />} />
        <Route path="/news" element={<NewsPage articles={articles} />} />
        <Route path="/contact" element={<ContactPage site={site} />} />
      </Routes>
    </div>
  );
}
