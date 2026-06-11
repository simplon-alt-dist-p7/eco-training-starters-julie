import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..', '..');

function readJson(relativePath: string) {
  return JSON.parse(readFileSync(path.join(projectRoot, relativePath), 'utf8'));
}

const app = express();
app.use(cors());
app.use(express.json());
app.use((req, _res, next) => {
  console.log('[showcase-api] ' + req.method + ' ' + req.url);
  next();
});
app.use('/assets', express.static(path.join(projectRoot, 'assets'), { maxAge: 0 }));
app.use((_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

app.get('/api/site', (_req, res) => {
  const site = readJson('data/site.json');
  const articles = readJson('data/articles.json');
  res.json({
    ...site,
    articles,
    generatedAt: new Date().toISOString()
  });
});

app.get('/api/articles', (_req, res) => {
  res.json(readJson('data/articles.json'));
});

app.get('/api/articles/:slug', (req, res) => {
  const articles = readJson('data/articles.json');
  const selected = articles.find((article: { slug: string }) => article.slug === req.params.slug) ?? articles[0];
  res.json({
    ...selected,
    analytics: {
      impressions: 1200,
      readRatio: 0.42,
      partnerMentions: ['analytics-suite', 'consent-widget', 'video-host']
    }
  });
});

app.get('/api/contact', (_req, res) => {
  const site = readJson('data/site.json');
  res.json({
    offices: site.offices,
    partners: site.partners,
    generatedAt: new Date().toISOString()
  });
});

app.post('/api/analytics/beacon', (req, res) => {
  res.json({
    received: true,
    payload: req.body,
    timestamp: Date.now()
  });
});

app.listen(4100, () => {
  console.log('heavy-showcase backend running on http://localhost:4100');
});
