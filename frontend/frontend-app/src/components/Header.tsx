import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ArrowUpRight, Menu, Search, ShoppingBag, X } from 'lucide-react'

interface HeaderProps { search: string; onSearch: (value: string) => void }

export function Header({ search, onSearch }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  return <header className="site-header">
    <div className="header-main wrap">
      <Link to="/" className="brand" aria-label="EcomPacific, inicio"><span className="brand-mark">e<span>.</span></span><span className="brand-name">ecompacific<small>HOGAR CON CALMA</small></span></Link>
      <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Navegación principal">
        <NavLink to="/" onClick={() => setMenuOpen(false)}>Tienda</NavLink><a href="#colecciones" onClick={() => setMenuOpen(false)}>Colecciones</a><a href="#nosotros" onClick={() => setMenuOpen(false)}>Nuestra historia</a>
      </nav>
      <label className="search-box"><Search size={17}/><input value={search} onChange={e => onSearch(e.target.value)} placeholder="Busca en la tienda" aria-label="Buscar productos"/><kbd>⌘ K</kbd></label>
      <button className="icon-button cart-button" aria-label="Carrito, 0 productos"><ShoppingBag size={20}/><span className="cart-count">0</span></button>
      <button className="icon-button menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}>{menuOpen ? <X/> : <Menu/>}</button>
    </div>
    <div className="announcement"><span>DISEÑO QUE SE SIENTE COMO EN CASA</span><span>Envíos a toda Colombia <ArrowUpRight size={13}/></span></div>
  </header>
}
