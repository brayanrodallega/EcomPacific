import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react'
import { Header } from '../components/Header'
import { getProducts } from '../services/productService'
import { useEffect, useState } from 'react'
import type { Product } from '../types/product'

const money = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })
export function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product>()
  const [search, setSearch] = useState('')
  useEffect(() => { getProducts().then(items => setProduct(items.find(item => item.id === id))) }, [id])
  return <><Header search={search} onSearch={setSearch}/><main className="detail-page wrap"><Link className="back-link" to="/"><ArrowLeft size={16}/> Volver al catÃ¡logo</Link>{product ? <div className="detail-layout"><div className="detail-image"><img src={product.image} alt={product.imageAlt}/></div><div className="detail-copy"><div className="eyebrow">{product.category.toUpperCase()} Â· VISTA DE DEMOSTRACIÃ“N</div><h1>{product.name}</h1><p className="detail-price">{money.format(product.price)}</p><p className="detail-description">{product.description}</p><p className={`detail-availability ${product.available ? '' : 'is-unavailable'}`}><Check size={16}/>{product.available ? 'Disponible para consultar' : 'Actualmente agotado'}</p><Link className="primary-button" to="/">Ver más piezas <ArrowUpRight size={16}/></Link><p className="detail-disclaimer">Los artÃ­culos mostrados son ilustrativos. Precios y disponibilidad de demostraciÃ³n.</p></div></div> : <div className="empty-state"><h3>Producto no encontrado</h3><Link className="text-link" to="/">Volver al catÃ¡logo <ArrowUpRight size={15}/></Link></div>}</main><footer className="site-footer wrap"><span>ecompacific <span className="footer-dot">.</span></span><span>Un lugar para sentirte en casa.</span><span>Â© 2025 EcomPacific</span></footer></>
}

