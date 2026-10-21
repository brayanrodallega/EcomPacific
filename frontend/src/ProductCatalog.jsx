import { useEffect, useMemo, useState } from 'react';
import { getProduct, getProducts } from './services/productService.js';

const currency = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

function currentProductId() {
  const match = window.location.hash.match(/^#productos\/(\d+)$/);
  return match?.[1] ?? null;
}

function useProductRoute() {
  const [productId, setProductId] = useState(currentProductId);
  useEffect(() => {
    const update = () => setProductId(currentProductId());
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);
  return productId;
}

function Brand() {
  return <a className="catalog-brand" href="#productos" aria-label="EcomPacific, productos">
    <span className="catalog-brand__mark" aria-hidden="true">E</span>
    <span>Ecom<span>Pacific</span></span>
  </a>;
}

function ProductImage({ product, large = false }) {
  const [failed, setFailed] = useState(false);
  const imageUrl = product.imagenUrl?.trim();

  if (!imageUrl || failed) {
    return <div className={`catalog-image-fallback${large ? ' catalog-image-fallback--large' : ''}`} role="img" aria-label={`Imagen no disponible para ${product.nombre}`}>
      <svg viewBox="0 0 48 48" aria-hidden="true"><rect x="6" y="8" width="36" height="32" rx="3"/><circle cx="17" cy="19" r="3"/><path d="m8 35 11-11 8 7 5-5 8 8"/></svg>
      <span>Imagen no disponible</span>
    </div>;
  }

  return <img className="catalog-product-image" src={imageUrl} alt={product.nombre} loading="lazy" onError={() => setFailed(true)} />;
}

function ProductCard({ product }) {
  return <article className="catalog-card">
    <a className="catalog-card__image" href={`#productos/${product.id}`} aria-label={`Ver detalles de ${product.nombre}`}>
      <ProductImage product={product} />
      <span className={`catalog-stock${product.disponible ? '' : ' catalog-stock--out'}`}>
        <i aria-hidden="true" />{product.disponible ? 'Disponible' : 'Agotado'}
      </span>
    </a>
    <div className="catalog-card__body">
      <p className="catalog-card__category">{product.categoriaNombre || 'EcomPacific'}</p>
      <h2><a href={`#productos/${product.id}`}>{product.nombre}</a></h2>
      <p className="catalog-card__description">{product.descripcion || 'Consulta los detalles de este producto.'}</p>
      <div className="catalog-card__footer">
        <strong>{currency.format(Number(product.precio) || 0)}</strong>
        <a href={`#productos/${product.id}`}>Ver detalles <span aria-hidden="true">↗</span></a>
      </div>
    </div>
  </article>;
}

function ProductDetail({ product, loading, error, onRetry }) {
  if (loading) return <p className="catalog-message" role="status">Cargando producto…</p>;
  if (error) return <div className="catalog-message catalog-message--error" role="alert"><p>{error}</p><button type="button" onClick={onRetry}>Reintentar</button></div>;
  if (!product) return <div className="catalog-message"><p>No encontramos ese producto.</p><a href="#productos">Volver al catálogo</a></div>;

  return <section className="product-detail" aria-labelledby="detail-title">
    <a className="catalog-back" href="#productos">← Volver al catálogo</a>
    <div className="product-detail__layout">
      <div className="product-detail__image"><ProductImage product={product} large /></div>
      <div className="product-detail__content">
        <p className="catalog-eyebrow">{product.categoriaNombre || 'EcomPacific'}</p>
        <h1 id="detail-title">{product.nombre}</h1>
        <p className="product-detail__price">{currency.format(Number(product.precio) || 0)}</p>
        <p className="product-detail__description">{product.descripcion || 'Este producto no tiene una descripción disponible.'}</p>
        <p className={`product-detail__availability${product.disponible ? '' : ' product-detail__availability--out'}`}>
          {product.disponible ? `Disponible${product.stock > 0 ? ` · ${product.stock} en existencia` : ''}` : 'Agotado'}
        </p>
      </div>
    </div>
  </section>;
}

export default function ProductCatalog() {
  const productId = useProductRoute();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [detailReloadKey, setDetailReloadKey] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    getProducts({ signal: controller.signal })
      .then(setProducts)
      .catch((cause) => { if (cause.name !== 'AbortError') setError(cause.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [reloadKey]);

  useEffect(() => {
    if (!productId) {
      setDetail(null);
      setDetailError('');
      return undefined;
    }
    const controller = new AbortController();
    setDetail(null);
    setDetailLoading(true);
    setDetailError('');
    getProduct(productId, { signal: controller.signal })
      .then(setDetail)
      .catch((cause) => { if (cause.name !== 'AbortError') setDetailError(cause.message); })
      .finally(() => { if (!controller.signal.aborted) setDetailLoading(false); });
    return () => controller.abort();
  }, [productId, detailReloadKey]);

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('es');
    if (!query) return products;
    return products.filter((product) =>
      `${product.nombre} ${product.descripcion || ''} ${product.categoriaNombre || ''}`
        .toLocaleLowerCase('es')
        .includes(query),
    );
  }, [products, search]);

  return <div className="catalog-page">
    <div className="catalog-announcement">Diseño para vivirlo todos los días <span aria-hidden="true">✳</span></div>
    <header className="catalog-header">
      <div className="catalog-header__inner">
        <Brand />
        <nav aria-label="Navegación principal"><a className={!productId ? 'is-active' : ''} href="#productos">Productos</a><a href="#login">Iniciar sesión</a></nav>
      </div>
    </header>
    <main>
      {!productId ? <>
        <section className="catalog-hero">
          <p className="catalog-eyebrow"><i aria-hidden="true" /> Colección EcomPacific</p>
          <h1>Piezas para sentirte <em>en casa.</em></h1>
          <p>Explora los productos disponibles en nuestro catálogo.</p>
        </section>
        <section className="catalog-content" aria-labelledby="catalog-title">
          <div className="catalog-content__heading">
            <div><p className="catalog-eyebrow">Encuentra tu próximo favorito</p><h2 id="catalog-title">Nuestros productos <small>({loading ? '…' : visibleProducts.length})</small></h2></div>
            <label className="catalog-search"><span className="sr-only">Buscar productos</span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/></svg><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar productos…" /></label>
          </div>
          {loading && <p className="catalog-message" role="status">Cargando productos…</p>}
          {!loading && error && <div className="catalog-message catalog-message--error" role="alert"><p>{error}</p><button type="button" onClick={() => setReloadKey((key) => key + 1)}>Reintentar</button></div>}
          {!loading && !error && products.length === 0 && <div className="catalog-message"><h3>Aún no hay productos disponibles</h3><p>Vuelve más tarde para conocer las novedades del catálogo.</p></div>}
          {!loading && !error && products.length > 0 && visibleProducts.length === 0 && <div className="catalog-message"><h3>No encontramos productos</h3><p>Prueba con otro término de búsqueda.</p><button type="button" onClick={() => setSearch('')}>Limpiar búsqueda</button></div>}
          {!loading && !error && visibleProducts.length > 0 && <div className="catalog-grid">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>}
        </section>
      </> : <div className="catalog-content"><ProductDetail product={detail} loading={detailLoading} error={detailError} onRetry={() => setDetailReloadKey((key) => key + 1)} /></div>}
    </main>
    <footer className="catalog-footer"><Brand /><p>Muebles hechos para acompañarte.</p><span>© {new Date().getFullYear()} EcomPacific</span></footer>
  </div>;
}
