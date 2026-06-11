import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Route, Routes, useParams } from 'react-router-dom';

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  heroAsset: string;
  thumbnails: string[];
  stock: number;
  shortDescription: string;
  longDescription: string;
  specs: Array<{ label: string; value: string }>;
  duplicateMarketingCopy: string[];
  recommendations: string[];
};

type ProductDetail = Product & {
  stockHistory: Array<{ day: string; stock: number }>;
};

type CartItem = {
  id: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  snapshot: Product;
};

type HomePayload = {
  hero: { title: string; subtitle: string };
  promos: Array<{ id: string; title: string; tone: string; asset: string }>;
  filters: { categories: string[]; priceRanges: string[] };
  featured: Product[];
};

type CartPayload = {
  items: CartItem[];
  subtotal: number;
  shipping: number;
};

type CheckoutPayload = {
  cart: { items: CartItem[] };
  subtotal: number;
  shipping: number;
  taxes: number;
  recommendations: Product[];
};

type SearchPayload = { count: number; results: Product[] };

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Echec sur ' + url);
  }
  return response.json() as Promise<T>;
}

function formatPrice(value: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(value);
}

function CommerceHeader({ cartCount }: { cartCount: number }) {
  return (
    <header className="shop-header">
      <div className="shop-branding">
        <span className="shop-kicker">Collection maison</span>
        <div>
          <strong>Maison Atelier</strong>
          <p>Mobilier, textile et accessoires pour les espaces de travail et d'accueil.</p>
        </div>
      </div>
      <nav className="shop-nav">
        <NavLink to="/">Accueil</NavLink>
        <NavLink to="/products">Catalogue</NavLink>
        <NavLink to="/search">Recherche</NavLink>
        <NavLink to="/cart">Panier ({cartCount})</NavLink>
        <NavLink to="/checkout">Commande</NavLink>
      </nav>
    </header>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="shop-product-card">
      <img src={product.heroAsset} alt={product.name} />
      <div className="shop-product-copy">
        <span>{product.category}</span>
        <h3>{product.name}</h3>
        <p>{product.shortDescription}</p>
        <div className="shop-product-footer">
          <strong>{formatPrice(product.price)}</strong>
          <Link to={'/products/' + product.id}>Voir la fiche</Link>
        </div>
      </div>
    </article>
  );
}

function HomePage({ home }: { home: HomePayload }) {
  const [promos, setPromos] = useState(home.promos);

  useEffect(() => {
    const timer = window.setInterval(() => {
      fetchJson<{ promos: HomePayload['promos'] }>('/api/promotions')
        .then((payload) => setPromos(payload.promos))
        .catch(() => undefined);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="shop-stack">
      <section className="shop-hero">
        <div className="shop-hero-copy">
          <p className="shop-eyebrow">Nouveautes</p>
          <h1>{home.hero.title}</h1>
          <p>{home.hero.subtitle}</p>
          <div className="shop-benefits">
            <span>Livraison suivie</span>
            <span>Selection en stock</span>
            <span>Conseils d'installation</span>
          </div>
        </div>
        <div className="shop-promo-column">
          {promos.map((promo) => (
            <article key={promo.id} className="shop-promo-card">
              <img src={promo.asset} alt={promo.title} />
              <div>
                <h3>{promo.title}</h3>
                <p>{promo.tone}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="shop-category-row">
        {home.filters.categories.map((category) => (
          <span key={category}>{category}</span>
        ))}
      </section>

      <section className="shop-shelf">
        <div className="shop-section-header">
          <p className="shop-eyebrow">Selection</p>
          <h2>Les pieces les plus consultees</h2>
        </div>
        <div className="shop-product-grid">
          {home.featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

function ProductsPage({ products, categories }: { products: Product[]; categories: string[] }) {
  return (
    <section className="shop-catalog-layout">
      <aside className="shop-filter-panel">
        <p className="shop-eyebrow">Catalogue</p>
        <h1>Collections</h1>
        <p>Un ensemble de references organisees par usage, matiere et environnement d'installation.</p>
        <div className="shop-chip-list">
          {categories.map((category) => (
            <span key={category}>{category}</span>
          ))}
        </div>
      </aside>
      <div className="shop-product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

function ProductDetailPage({ products }: { products: Product[] }) {
  const { id } = useParams();
  const [detail, setDetail] = useState<ProductDetail | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    fetchJson<ProductDetail>('/api/products/' + id).then(setDetail).catch(() => setDetail(null));
  }, [id]);

  const current = detail ?? products.find((product) => product.id === id) ?? products[0];
  const recommended = current ? products.filter((product) => current.recommendations.includes(product.id)) : [];

  if (!current) {
    return <main className="shop-stack"><p>Produit introuvable.</p></main>;
  }

  return (
    <div className="shop-stack">
      <section className="shop-detail-layout">
        <div className="shop-gallery-panel">
          <img src={current.heroAsset} alt={current.name} className="shop-main-image" />
          <div className="shop-thumbnail-row">
            {current.thumbnails.map((asset) => (
              <img key={asset} src={asset} alt={current.name} />
            ))}
          </div>
        </div>
        <article className="shop-summary-panel">
          <p className="shop-eyebrow">Fiche produit</p>
          <h1>{current.name}</h1>
          <p>{current.longDescription}</p>
          <div className="shop-price-row">
            <strong>{formatPrice(current.price)}</strong>
            <span>{current.rating.toFixed(1)} / 5</span>
            <span>{current.stock} en stock</span>
          </div>
          <div className="shop-copy-list">
            {current.duplicateMarketingCopy.map((item, index) => (
              <p key={item + index}>{item}</p>
            ))}
          </div>
        </article>
      </section>

      {detail?.stockHistory ? (
        <section className="shop-stock-panel">
          <div className="shop-section-header">
            <p className="shop-eyebrow">Disponibilite</p>
            <h2>Historique de stock</h2>
          </div>
          <div className="shop-stock-bars">
            {detail.stockHistory.map((point) => (
              <div key={point.day} className="shop-stock-item">
                <span style={{ height: point.stock * 2 + 'px' }} />
                <small>{point.day}</small>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="shop-spec-grid">
        {current.specs.map((spec) => (
          <article key={spec.label} className="shop-spec-card">
            <span>{spec.label}</span>
            <strong>{spec.value}</strong>
          </article>
        ))}
      </section>

      {recommended.length > 0 ? (
        <section className="shop-shelf">
          <div className="shop-section-header">
            <p className="shop-eyebrow">Associer</p>
            <h2>Suggestions complementaires</h2>
          </div>
          <div className="shop-product-grid">
            {recommended.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function SearchPage({ categories }: { categories: string[] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const url = '/api/search?q=' + encodeURIComponent(query) + '&category=' + encodeURIComponent(category);
    fetchJson<SearchPayload>(url)
      .then((payload) => {
        setResults(payload.results);
        setCount(payload.count);
      })
      .catch(() => {
        setResults([]);
        setCount(0);
      });
  }, [query, category]);

  return (
    <div className="shop-stack">
      <section className="shop-search-panel">
        <div>
          <p className="shop-eyebrow">Recherche</p>
          <h1>Trouver une reference</h1>
        </div>
        <div className="shop-search-controls">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nom, collection ou mot-cle" />
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">Toutes les categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>
        <p>{count} resultat(s)</p>
      </section>

      <div className="shop-product-grid">
        {results.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

function CartPage({ cart }: { cart: CartPayload }) {
  return (
    <section className="shop-order-layout">
      <div className="shop-order-list">
        <div className="shop-section-header">
          <p className="shop-eyebrow">Panier</p>
          <h1>Votre selection</h1>
        </div>
        {cart.items.map((item) => (
          <article key={item.id} className="shop-order-item">
            <img src={item.snapshot.heroAsset} alt={item.snapshot.name} />
            <div>
              <strong>{item.snapshot.name}</strong>
              <p>{item.snapshot.shortDescription}</p>
            </div>
            <span>{item.quantity}</span>
            <strong>{formatPrice(item.lineTotal)}</strong>
          </article>
        ))}
      </div>
      <aside className="shop-summary-card">
        <h2>Recapitulatif</h2>
        <div>
          <span>Sous-total</span>
          <strong>{formatPrice(cart.subtotal)}</strong>
        </div>
        <div>
          <span>Livraison</span>
          <strong>{formatPrice(cart.shipping)}</strong>
        </div>
        <div>
          <span>Total</span>
          <strong>{formatPrice(cart.subtotal + cart.shipping)}</strong>
        </div>
      </aside>
    </section>
  );
}

function CheckoutPage({ checkout }: { checkout: CheckoutPayload | null }) {
  if (!checkout) {
    return <main className="shop-stack"><p>Chargement de la commande...</p></main>;
  }

  return (
    <div className="shop-stack">
      <section className="shop-checkout-grid">
        <article className="shop-checkout-panel">
          <p className="shop-eyebrow">Commande</p>
          <h1>Finaliser la commande</h1>
          <div className="shop-step-list">
            <div>
              <strong>1. Livraison</strong>
              <p>Adresse principale, horaires et consignes d'installation.</p>
            </div>
            <div>
              <strong>2. Facturation</strong>
              <p>Coordonnees, TVA et informations de facturation.</p>
            </div>
            <div>
              <strong>3. Validation</strong>
              <p>Verification du panier, des taxes et des delais.</p>
            </div>
          </div>
        </article>
        <aside className="shop-summary-card">
          <h2>Montants</h2>
          <div>
            <span>Sous-total</span>
            <strong>{formatPrice(checkout.subtotal)}</strong>
          </div>
          <div>
            <span>Livraison</span>
            <strong>{formatPrice(checkout.shipping)}</strong>
          </div>
          <div>
            <span>Taxes</span>
            <strong>{formatPrice(checkout.taxes)}</strong>
          </div>
          <div>
            <span>Total TTC</span>
            <strong>{formatPrice(checkout.subtotal + checkout.shipping + checkout.taxes)}</strong>
          </div>
        </aside>
      </section>

      <section className="shop-shelf">
        <div className="shop-section-header">
          <p className="shop-eyebrow">A ajouter</p>
          <h2>Suggestions pour la commande</h2>
        </div>
        <div className="shop-product-grid">
          {checkout.recommendations.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default function ShopApp() {
  const [home, setHome] = useState<HomePayload | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartPayload | null>(null);
  const [checkout, setCheckout] = useState<CheckoutPayload | null>(null);

  useEffect(() => {
    Promise.all([
      fetchJson<HomePayload>('/api/shop/home'),
      fetchJson<Product[]>('/api/products'),
      fetchJson<CartPayload>('/api/cart'),
      fetchJson<CheckoutPayload>('/api/checkout')
    ]).then(([homePayload, productPayload, cartPayload, checkoutPayload]) => {
      setHome(homePayload);
      setProducts(productPayload);
      setCart(cartPayload);
      setCheckout(checkoutPayload);
    });
  }, []);

  const categories = useMemo(() => Array.from(new Set(products.map((product) => product.category))), [products]);
  const cartCount = cart ? cart.items.reduce((total, item) => total + item.quantity, 0) : 0;

  if (!home || !cart) {
    return <main className="shop-app"><p className="shop-loading">Chargement de la boutique...</p></main>;
  }

  return (
    <div className="shop-app">
      <CommerceHeader cartCount={cartCount} />
      <Routes>
        <Route path="/" element={<HomePage home={home} />} />
        <Route path="/products" element={<ProductsPage products={products} categories={categories} />} />
        <Route path="/products/:id" element={<ProductDetailPage products={products} />} />
        <Route path="/search" element={<SearchPage categories={categories} />} />
        <Route path="/cart" element={<CartPage cart={cart} />} />
        <Route path="/checkout" element={<CheckoutPage checkout={checkout} />} />
      </Routes>
    </div>
  );
}
