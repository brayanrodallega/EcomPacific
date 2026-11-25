import { useEffect, useMemo, useState } from 'react'
import { Check, ChevronDown, SlidersHorizontal } from 'lucide-react'
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

  const loadProducts = () => {
    setError(false)
    setLoading(true)
    getProducts().then(setProducts).catch(() => setError(true)).finally(() => setLoading(false))
  }
  useEffect(() => { loadProducts() }, [])
  const categories = useMemo(() => ['Todas', ...new Set(products.map(product => product.category))], [products])
  const visibleProducts = useMemo(() => {
    const result = products.filter(product => product.name.toLocaleLowerCase('es').includes(search.trim().toLocaleLowerCase('es')) && (category === 'Todas' || product.category === category))
    if (sort === 'low') result.sort((a, b) => a.price - b.price)
    if (sort === 'high') result.sort((a, b) => b.price - a.price)
    return result
  }, [products, search, category, sort])

  return <div className="dashboard-page">
    <Header search={search} onSearch={setSearch} variant="dashboard"/>
    <main className="dashboard-main wrap">
      <section className="dashboard-hero"><div className="dashboard-kicker">TIENDA LOCAL&nbsp; / &nbsp;RECOGIDA EN TIENDA</div><h1>Productos del Pacífico</h1><p>Consulta precios y disponibilidad antes de hacer tu pedido.</p><span>Pago al recoger</span></section>
      <section className="dashboard-catalog" id="catalogo">
        <div className="dashboard-title"><h2>Catálogo de productos</h2>{!loading && !error && <p>{visibleProducts.length} productos · Precios en pesos colombianos</p>}</div>
        <div className="catalog-toolbar dashboard-toolbar"><button className="filter-toggle" onClick={() => setCategoriesOpen(!categoriesOpen)}><SlidersHorizontal size={16}/> Categoría <ChevronDown size={15}/></button><span className="result-count">{loading ? 'Cargando…' : `${visibleProducts.length} productos`}</span><label className="sort-select"><span>Ordenar por</span><select value={sort} onChange={e => setSort(e.target.value)} aria-label="Ordenar por precio"><option value="featured">Destacados</option><option value="low">Precio: menor a mayor</option><option value="high">Precio: mayor a menor</option></select><ChevronDown size={15}/></label></div>
        <div className={`category-list ${categoriesOpen ? 'is-open' : ''}`} aria-label="Filtrar por categoría">{categories.map(item => <button key={item} className={category === item ? 'category-chip active' : 'category-chip'} onClick={() => { setCategory(item); setCategoriesOpen(false) }}>{item}{category === item && <Check size={13}/>}</button>)}</div>
        {loading && <div className="dashboard-grid">{[1, 2, 3].map(item => <div className="dashboard-state" key={item}>Cargando productos…</div>)}</div>}
        {error && <div className="dashboard-state"><span>NO DISPONIBLE TEMPORALMENTE</span><h3>No pudimos cargar el catálogo</h3><p>Comprueba tu conexión e intenta nuevamente.</p><button className="dashboard-button" onClick={loadProducts}>Reintentar</button></div>}
        {!loading && !error && visibleProducts.length === 0 && <div className="dashboard-state"><span>0 PRODUCTOS</span><h3>Aún no hay productos publicados</h3><p>Vuelve más tarde para consultar el catálogo.</p></div>}
        {!loading && !error && visibleProducts.length > 0 && <div className="product-grid dashboard-grid">{visibleProducts.map(product => <article className="product-card dashboard-card" key={product.id}><Link className="product-image" to={`/productos/${product.id}`} aria-label={`Ver ${product.name}`}><img src={product.image} alt={product.imageAlt} loading="lazy"/></Link><div className="product-info"><div className="product-meta"><span>{product.category}</span></div><div className="product-title-row"><h3>{product.name}</h3></div><div className="product-price">{money.format(product.price)}</div><span className={`dashboard-availability ${product.available ? '' : 'unavailable'}`}>{product.available ? 'Disponible' : 'Agotado'}</span></div></article>)}</div>}
      </section>
    </main>
    <footer className="dashboard-footer wrap"><span>EcomPacific&nbsp; / &nbsp;Catálogo público</span><a href="#catalogo">Índice del prototipo</a></footer>
  </div>
}
