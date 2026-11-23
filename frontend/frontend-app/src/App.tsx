import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { CatalogPage } from './pages/CatalogPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import './App.css'

export default function App() {
  return <BrowserRouter><Routes><Route path="/" element={<CatalogPage/>}/><Route path="/productos/:id" element={<ProductDetailPage/>}/><Route path="*" element={<CatalogPage/>}/></Routes></BrowserRouter>
}
