import { useEffect, useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, ArrowUpRight, Check, ChevronDown, SlidersHorizontal } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Header } from '../components/Header'
import { getProducts } from '../services/productService'
import type { Product } from '../types/product'

const money = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })

export function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todas')
  const [sort, setSort] = useState('featured')
  const [categoriesOpen, setCategoriesOpen] = useState(false)

  useEffect(() => { getProducts().then(setProducts).catch(() => setError(true)).finally(() => setLoading(false)) }, [])
  const categories = useMemo(() => ['Todas', ...new Set(products.map(product => product.category))], [products])
  const visibleProducts = useMemo(() => {
    const result = products.filter(product => product.name.toLocaleLowerCase('es').includes(search.trim().toLocaleLowerCase('es')) && (category === 'Todas' || product.category === category))
    if (sort === 'low') result.sort((a, b) => a.price - b.price)
    if (sort === 'high') result.sort((a, b) => b.price - a.price)
    return result
  }, [products, search, category, sort])

  return <><Header search={search} onSearch={setSearch}/><main>
    <section className="hero wrap" id="colecciones"><div className="hero-copy"><div className="eyebrow"><span className="eyebrow-dot"/>ESPACIOS PARA VIVIRLOS</div><h1>Tu casa, a tu<br/><em>manera.</em></h1><p>Piezas que hacen de cada rincón un lugar para quedarse un rato más.</p><a className="text-link" href="#catalogo">Explorar colección <ArrowDown size={16}/></a></div><div className="hero-image"><img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=90" alt="Sala cálida y luminosa con mobiliario de diseño"/><div className="image-caption"><span>01 / ESPACIOS CON INTENCIÓN</span><span>Detalles que hacen hogar</span></div></div><span className="hero-index">E / 01</span></section>
    <section className="catalog-section wrap" id="catalogo"><div className="section-heading"><div><div className="eyebrow">HECHO PARA TU DÍA A DÍA</div><h2>Encuentra tu espacio</h2></div><p>Diseño funcional, materiales nobles<br/>y tiempo para disfrutarlo.</p></div>
      <div className="demo-note"><span className="demo-dot"/><span><strong>Vista de demostración</strong> · Productos e imágenes ilustrativos; el catálogo real aún no está conectado.</span></div>
      <div className="catalog-toolbar"><button className="filter-toggle" onClick={() => setCategoriesOpen(!categoriesOpen)}><SlidersHorizontal size={16}/> Categoría <ChevronDown size={15}/></button><span className="result-count">{loading ? 'Cargando…' : `${visibleProducts.length} piezas`}</span><label className="sort-select"><span>Ordenar por</span><select value={sort} onChange={e => setSort(e.target.value)} aria-label="Ordenar por precio"><option value="featured">Destacados</option><option value="low">Precio: menor a mayor</option><option value="high">Precio: mayor a menor</option></select><ChevronDown size={15}/></label></div>
      <div className={`category-list ${categoriesOpen ? 'is-open' : ''}`} aria-label="Filtrar por categoría">{categories.map(item => <button key={item} className={category === item ? 'category-chip active' : 'category-chip'} onClick={() => { setCategory(item); setCategoriesOpen(false) }}>{item}{category === item && <Check size={13}/>}</button>)}</div>
      {loading && <div className="product-grid" aria-label="Cargando productos">{[1,2,3,4].map(item => <div className="skeleton-card" key={item}><div className="skeleton-image"/><div className="skeleton-line"/><div className="skeleton-line short"/></div>)}</div>}
      {error && <div className="empty-state"><h3>No pudimos cargar el catálogo</h3><p>Intenta de nuevo en unos momentos.</p><button className="primary-button" onClick={() => { setError(false); setLoading(true); getProducts().then(setProducts).catch(() => setError(true)).finally(() => setLoading(false)) }}>Volver a intentar</button></div>}
      {!loading && !error && visibleProducts.length === 0 && <div className="empty-state"><h3>No encontramos piezas</h3><p>Prueba con otro nombre o categoría.</p><button className="text-link" onClick={() => { setSearch(''); setCategory('Todas') }}>Limpiar filtros <ArrowUp size={15}/></button></div>}
      {!loading && !error && visibleProducts.length > 0 && <div className="product-grid">{visibleProducts.map((product, index) => <article className="product-card" key={product.id}><Link className="product-image" to={`/productos/${product.id}`} aria-label={`Ver ${product.name}`}><img src={product.image} alt={product.imageAlt} loading="lazy"/><span className={`availability ${product.available ? 'available' : 'unavailable'}`}><span/>{product.available ? 'Disponible' : 'Agotado'}</span>{product.tag && <span className="product-tag">{product.tag}</span>}<span className="image-arrow"><ArrowUpRight size={19}/></span></Link><div className="product-info"><div className="product-meta"><span>{product.category}</span><span>0{index + 1}</span></div><div className="product-title-row"><h3>{product.name}</h3><span className="product-price">{money.format(product.price)}</span></div><Link className="detail-link" to={`/productos/${product.id}`}>Ver detalle <ArrowUpRight size={14}/></Link></div></article>)}</div>}
    </section>
    <section className="closing-banner wrap" id="nosotros"><div className="closing-mark">e.</div><div><div className="eyebrow">MENOS PRISA, MÁS HOGAR</div><h2>El espacio también<br/>cuenta tu historia.</h2></div><a className="text-link" href="#catalogo">Descubre la colección <ArrowUpRight size={16}/></a></section>
  </main><footer className="site-footer wrap"><span>ecompacific <span className="footer-dot">.</span></span><span>Un lugar para sentirte en casa.</span><span>© 2025 EcomPacific</span></footer></>
}
