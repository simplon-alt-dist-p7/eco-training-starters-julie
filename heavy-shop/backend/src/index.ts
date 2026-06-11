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
  console.log('[shop-api] ' + req.method + ' ' + req.url);
  next();
});
app.use('/assets', express.static(path.join(projectRoot, 'assets'), { maxAge: 0 }));
app.use((_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

app.get('/api/shop/home', (_req, res) => {
  const shop = readJson('data/shop.json');
  const products = readJson('data/products.json');
  res.json({
    ...shop,
    featured: products.slice(0, 6),
    generatedAt: new Date().toISOString()
  });
});

app.get('/api/products', (_req, res) => {
  res.json(readJson('data/products.json'));
});

app.get('/api/products/:id', (req, res) => {
  const products = readJson('data/products.json');
  const product = products.find((entry: { id: string }) => entry.id === req.params.id) ?? products[0];
  res.json({
    ...product,
    stockHistory: Array.from({ length: 8 }, (_, index) => ({
      day: 'J-' + index,
      stock: product.stock - index
    }))
  });
});

app.get('/api/search', (req, res) => {
  const products = readJson('data/products.json');
  const query = String(req.query.q ?? '').toLowerCase();
  const category = String(req.query.category ?? '');
  const filtered = products.filter((product: { name: string; category: string }) => {
    const matchesQuery = query.length === 0 || product.name.toLowerCase().includes(query);
    const matchesCategory = category.length === 0 || product.category === category;
    return matchesQuery && matchesCategory;
  });

  res.json({
    count: filtered.length,
    results: filtered,
    filtersEcho: req.query
  });
});

app.get('/api/promotions', (_req, res) => {
  const shop = readJson('data/shop.json');
  res.json({
    promos: shop.promos,
    refreshedAt: Date.now()
  });
});

app.get('/api/stock/:id', (req, res) => {
  const products = readJson('data/products.json');
  const product = products.find((entry: { id: string }) => entry.id === req.params.id) ?? products[0];
  res.json({
    id: product.id,
    stock: product.stock,
    requestedAt: new Date().toISOString()
  });
});

app.get('/api/cart', (_req, res) => {
  const shop = readJson('data/shop.json');
  res.json({
    ...shop.cart,
    subtotal: shop.cart.items.reduce((total: number, item: { lineTotal: number }) => total + item.lineTotal, 0),
    shipping: 12,
    generatedAt: new Date().toISOString()
  });
});

app.get('/api/checkout', (_req, res) => {
  const shop = readJson('data/shop.json');
  const products = readJson('data/products.json');
  const subtotal = shop.cart.items.reduce((total: number, item: { lineTotal: number }) => total + item.lineTotal, 0);
  res.json({
    cart: shop.cart,
    subtotal,
    shipping: 12,
    taxes: subtotal * 0.2,
    recommendations: products.slice(3, 7)
  });
});

app.listen(4100, () => {
  console.log('heavy-shop backend running on http://localhost:4100');
});
