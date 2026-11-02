import { useState } from 'react';
import type { Product } from '../types/product';

const currency = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

export function ProductDetail({ product }: { product: Product }) {
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage = Boolean(product.imagenUrl?.trim()) && !imageFailed;

  return (
    <section className="detail-section" aria-labelledby="detail-title">
      <a className="detail-back" href="/#catalogo"><span aria-hidden="true">←</span> Volver al catálogo</a>
      <div className="detail-layout">
        <div className="detail-media">
          {hasImage ? (
            <img src={product.imagenUrl!} alt={product.nombre || 'Producto del catálogo'} onError={() => setImageFailed(true)} />
          ) : (
            <div className="detail-placeholder" role="img" aria-label="Imagen no disponible">
              <span className="placeholder-sun" /><span className="placeholder-vase" />
              <span className="placeholder-leaf leaf-one" /><span className="placeholder-leaf leaf-two" />
              <span className="placeholder-caption">Imagen no disponible</span>
            </div>
          )}
        </div>
        <div className="detail-info">
          <p className="eyebrow"><span /> DETALLE DEL PRODUCTO</p>
          <p className="product-id">Ref. {product.id}</p>
          <h1 id="detail-title">{product.nombre || 'Producto sin nombre'}</h1>
          <p className="detail-price">{currency.format(Number(product.precio) || 0)}</p>
          <p className={`detail-availability ${product.disponible ? 'is-available' : 'is-unavailable'}`}>
            <span className="availability-dot" />{product.disponible ? 'Disponible' : 'Agotado'}
          </p>
          <a className="detail-cta" href="/#catalogo">Seguir explorando <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>
  );
}
