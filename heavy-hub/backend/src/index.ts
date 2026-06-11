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
  console.log('[hub-api] ' + req.method + ' ' + req.url);
  next();
});
app.use('/assets', express.static(path.join(projectRoot, 'assets'), { maxAge: 0 }));
app.use((_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

app.get('/api/home', (_req, res) => {
  const hub = readJson('data/hub.json');
  const content = readJson('data/content.json');
  res.json({
    ...hub.home,
    featured: content.slice(0, 5),
    generatedAt: new Date().toISOString()
  });
});

app.get('/api/library', (_req, res) => {
  res.json(readJson('data/content.json'));
});

app.get('/api/content/:id', (req, res) => {
  const content = readJson('data/content.json');
  const selected = content.find((item: { id: string }) => item.id === req.params.id) ?? content[0];
  res.json({
    ...selected,
    related: content.slice(0, 4)
  });
});

app.get('/api/dashboard', (_req, res) => {
  const content = readJson('data/content.json');
  res.json({
    enrolled: content.length,
    completed: 3,
    streak: 12,
    pendingActions: 7,
    focus: content.slice(2, 6)
  });
});

app.get('/api/notifications', (_req, res) => {
  const hub = readJson('data/hub.json');
  res.json({
    items: hub.notifications,
    generatedAt: Date.now()
  });
});

app.get('/api/profile', (_req, res) => {
  const hub = readJson('data/hub.json');
  res.json(hub.profile);
});

app.listen(4100, () => {
  console.log('heavy-hub backend running on http://localhost:4100');
});
