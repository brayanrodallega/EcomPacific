import { useState } from 'react';
import type { Product } from '../types/product';

const currency = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

function ProductArtwork() {
  return (
    <div className="image-placeholder" aria-label="Producto sin imagen">
      <span className="placeholder-sun" />
      <span className="placeholder-vase" />
      <span className="placeholder-leaf leaf-one" />
      <span className="placeholder-leaf leaf-two" />
      <span className="placeholder-caption">Imagen no disponible</span>
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage = Boolean(product.imagenUrl?.trim()) && !imageFailed;

  return (
    <article className="product-card">
      <div className="product-media">
        {hasImage ? (
          <img
            className="product-image"
            src={product.imagenUrl!}
            alt={product.nombre || 'Producto del catálogo'}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <ProductArtwork />
        )}
        <span className={`availability ${product.disponible ? 'is-available' : 'is-unavailable'}`}>
          <span className="availability-dot" />
          {product.disponible ? 'Disponible' : 'Agotado'}
        </span>
      </div>
      <div className="product-info">
        <div className="product-heading">
          <span className="product-id">Ref. {product.id}</span>
          <span className="product-mark" aria-hidden="true">✳</span>
        </div>
        <h3>{product.nombre || 'Producto sin nombre'}</h3>
        <p className="product-price">{currency.format(Number(product.precio) || 0)}</p>
      </div>
    </article>
  );
}
