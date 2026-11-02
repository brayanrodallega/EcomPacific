import { useEffect, useMemo, useState } from 'react';
import { ProductCard } from './components/ProductCard';
import { ProductDetail } from './components/ProductDetail';
import { LoginPage } from './components/LoginPage';
import { DashboardPage } from './components/DashboardPage';
import { getProductById, getProducts, ProductApiError } from './services/products.service';
import type { Product } from './types/product';

type SortOrder = 'recent' | 'price-asc' | 'price-desc';

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 4.2 4.2" />
    </svg>
  );
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('recent');
  const [reload, setReload] = useState(0);
  const [pathname, setPathname] = useState(() => window.location.pathname);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [detailNotFound, setDetailNotFound] = useState(false);

  useEffect(() => {
    const syncPath = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', syncPath);
    return () => window.removeEventListener('popstate', syncPath);
  }, []);

  const detailMatch = pathname.match(/^\/productos\/(\d+)\/?$/);
  const isProductRoute = pathname.startsWith('/productos/');
  const isLoginRoute = pathname === '/login';
  const isDashboardRoute = pathname === '/dashboard';

  useEffect(() => {
    if (isProductRoute || isLoginRoute || isDashboardRoute) return;
    const controller = new AbortController();
    setLoading(true);
    setError('');
    getProducts(controller.signal)
      .then(setProducts)
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === 'AbortError') return;
        setError(reason instanceof Error ? reason.message : 'No se pudieron cargar los productos.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [reload, isProductRoute, isLoginRoute, isDashboardRoute]);

  useEffect(() => {
    if (!detailMatch) {
      setDetailProduct(null);
      setDetailError('');
      setDetailNotFound(false);
      setDetailLoading(false);
      return;
    }
    const controller = new AbortController();
    setDetailProduct(null);
    setDetailError('');
    setDetailNotFound(false);
    setDetailLoading(true);
    getProductById(Number(detailMatch[1]), controller.signal)
      .then(setDetailProduct)
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === 'AbortError') return;
        if (reason instanceof ProductApiError && reason.status === 404) {
          setDetailNotFound(true);
          return;
        }
        setDetailError(reason instanceof Error ? reason.message : 'No se pudo cargar el producto.');
      })
      .finally(() => { if (!controller.signal.aborted) setDetailLoading(false); });
    return () => controller.abort();
  }, [pathname]);

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('es');
    const filtered = products.filter((product) => product.nombre?.toLocaleLowerCase('es').includes(query));
    if (sortOrder === 'price-asc') return [...filtered].sort((a, b) => Number(a.precio) - Number(b.precio));
    if (sortOrder === 'price-desc') return [...filtered].sort((a, b) => Number(b.precio) - Number(a.precio));
    return filtered;
  }, [products, search, sortOrder]);

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="EcomPacific, inicio">
          <span className="brand-symbol" aria-hidden="true"><i /><i /><i /></span>
          <span>Ecom<span className="brand-light">Pacific</span></span>
        </a>
        <nav className="main-nav" aria-label="Navegación principal">
          <a className="nav-link active" href="/#catalogo">Catálogo</a>
          <a className="nav-link" href="/#sobre-catalogo">Nuestra selección</a>
        </nav>
        <a className="nav-note" href="/login"><span className="nav-note-dot" /> Iniciar sesión</a>
      </header>

      {isLoginRoute ? <LoginPage /> : isDashboardRoute ? <DashboardPage /> : isProductRoute ? (
        <main id="inicio">
          {detailLoading ? <div className="detail-loading" aria-live="polite">Cargando producto...</div> : detailProduct ? <ProductDetail product={detailProduct} /> : detailNotFound ? (
            <section className="message-panel detail-not-found" role="status">
              <span className="message-icon">!</span>
              <h1>Producto no encontrado</h1>
              <p>Este producto no existe o ya no está disponible.</p>
              <a className="retry-button" href="/#catalogo">Volver al catálogo</a>
            </section>
          ) : detailError ? (
            <section className="message-panel detail-not-found" role="alert">
              <span className="message-icon">!</span>
              <h1>No pudimos cargar el producto</h1>
              <p>{detailError}</p>
              <a className="retry-button" href="/#catalogo">Volver al catálogo</a>
            </section>
          ) : (
            <section className="message-panel detail-not-found" role="status">
              <span className="message-icon">!</span>
              <h1>Producto no encontrado</h1>
              <p>Este producto no está disponible o el enlace ya no es válido.</p>
              <a className="retry-button" href="/#catalogo">Volver al catálogo</a>
            </section>
          )}
        </main>
      ) : <main id="inicio">
        <section className="hero" id="sobre-catalogo" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span /> OBJETOS PARA VIVIR MEJOR</p>
            <h1 id="hero-title">Un hogar que<br /><em>se siente tuyo.</em></h1>
            <p className="hero-description">Piezas que acompañan tus días, crean calma y hacen espacio para lo que importa.</p>
            <a className="hero-cta" href="#catalogo">Explorar el catálogo <span aria-hidden="true">↘</span></a>
            <div className="hero-footnote"><span className="hero-footnote-line" /> Descubre la colección disponible</div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="art-circle circle-back" />
            <div className="art-window"><span /><span /><span /><span /></div>
            <div className="art-plant"><i /><i /><i /><i /><b /></div>
            <div className="art-table"><span /><i /><i /></div>
            <div className="art-vase"><i /></div>
            <div className="art-sun" />
            <span className="art-label">ESPACIOS CON CALMA <b>✳</b></span>
          </div>
          <div className="hero-index"><span>01</span><i /> CATÁLOGO</div>
        </section>

        <section className="catalog-section" id="catalogo" aria-labelledby="catalog-title">
          <div className="catalog-topline">
            <div>
              <p className="eyebrow catalog-eyebrow"><span /> LA COLECCIÓN</p>
              <h2 id="catalog-title">Encuentra tu <em>favorito.</em></h2>
            </div>
            <p className="catalog-intro">Una selección para hacer de cada rincón<br className="desktop-break" /> un lugar donde quieras estar.</p>
          </div>

          <div className="catalog-toolbar">
            <div className="search-wrap">
              <SearchIcon />
              <label className="sr-only" htmlFor="product-search">Buscar productos por nombre</label>
              <input
                id="product-search"
                type="search"
                placeholder="¿Qué estás buscando?"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              {search && <button className="clear-search" type="button" onClick={() => setSearch('')} aria-label="Limpiar búsqueda">×</button>}
            </div>
            <div className="catalog-meta">
              <span className="product-count">{loading ? 'Cargando…' : `${visibleProducts.length} ${visibleProducts.length === 1 ? 'producto' : 'productos'}`}</span>
              <label className="sort-control" htmlFor="sort-products">Ordenar por
                <select id="sort-products" value={sortOrder} onChange={(event) => setSortOrder(event.target.value as SortOrder)}>
                  <option value="recent">Más recientes</option>
                  <option value="price-asc">Precio: menor a mayor</option>
                  <option value="price-desc">Precio: mayor a menor</option>
                </select>
              </label>
            </div>
          </div>

          {loading && (
            <div className="product-grid" aria-label="Cargando productos" aria-busy="true">
              {Array.from({ length: 6 }, (_, index) => <div className="skeleton-card" key={index}><div className="skeleton-image" /><div className="skeleton-line" /><div className="skeleton-line short" /></div>)}
            </div>
          )}

          {!loading && error && (
            <div className="message-panel error-panel" role="alert">
              <span className="message-icon">!</span>
              <h3>No pudimos cargar el catálogo</h3>
              <p>{error}</p>
              <button className="retry-button" type="button" onClick={() => setReload((value) => value + 1)}>Intentar de nuevo <span aria-hidden="true">↻</span></button>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="message-panel empty-panel">
              <span className="empty-spark" aria-hidden="true">✳</span>
              <h3>Estamos preparando el espacio</h3>
              <p>Por ahora no hay productos disponibles para mostrar. Vuelve pronto para descubrir novedades.</p>
            </div>
          )}

          {!loading && !error && products.length > 0 && visibleProducts.length === 0 && (
            <div className="message-panel empty-panel search-empty">
              <span className="empty-spark" aria-hidden="true"><SearchIcon /></span>
              <h3>No encontramos coincidencias</h3>
              <p>Prueba con otro nombre o limpia tu búsqueda para ver todos los productos.</p>
              <button className="text-button" type="button" onClick={() => setSearch('')}>Limpiar búsqueda</button>
            </div>
          )}

          {!loading && !error && visibleProducts.length > 0 && (
            <div className="product-grid">
              {visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          )}
          {!loading && !error && products.length > 0 && <p className="catalog-source">Productos publicados por EcomPacific</p>}
        </section>
      </main>}

      <footer className="footer">
        <a className="brand footer-brand" href="/"><span className="brand-symbol" aria-hidden="true"><i /><i /><i /></span><span>Ecom<span className="brand-light">Pacific</span></span></a>
        <p>Hecho para sentirte en casa.</p>
        <a className="back-top" href="#inicio">Volver arriba ↑</a>
        <span className="footer-copy">© 2026 EcomPacific</span>
      </footer>
    </div>
  );
}

export default App;
