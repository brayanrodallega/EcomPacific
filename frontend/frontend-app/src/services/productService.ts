import type { Product } from '../types/product'

// Clearly labeled illustrative content used until a real product API is available.
const demoProducts: Product[] = [
  { id: 'demo-01', name: 'Sofá Nórdico', category: 'Sala', price: 2490000, available: true, description: 'Un sofá de líneas limpias y proporciones cómodas, pensado para convertirse en el centro de tu sala.', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=85', imageAlt: 'Sofá contemporáneo en sala luminosa', tag: 'Favorito' },
  { id: 'demo-02', name: 'Silla Arco', category: 'Comedor', price: 689000, available: true, description: 'Silueta envolvente y acabados cálidos para acompañar tus comidas de todos los días.', image: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=85', imageAlt: 'Silla de diseño de madera y tapizado claro' },
  { id: 'demo-03', name: 'Mesa Roble', category: 'Comedor', price: 1890000, available: true, description: 'Una mesa de comedor versátil con espacio para compartir sin prisa.', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85', imageAlt: 'Comedor moderno con mesa de madera' },
  { id: 'demo-04', name: 'Lámpara Serena', category: 'Iluminación', price: 429000, available: false, description: 'Luz suave y ambiente acogedor para tus rincones favoritos.', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85', imageAlt: 'Lámpara de mesa encendida en un espacio acogedor', tag: 'Agotado' },
  { id: 'demo-05', name: 'Butaca Brisa', category: 'Sala', price: 1290000, available: true, description: 'Un asiento generoso para leer, descansar y hacer una pausa.', image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=900&q=85', imageAlt: 'Butaca tapizada de diseño contemporáneo' },
  { id: 'demo-06', name: 'Mesa de noche Alba', category: 'Dormitorio', price: 549000, available: true, description: 'Un complemento funcional de acabado natural para acompañar tu descanso.', image: 'https://images.unsplash.com/photo-1499933374294-4584851497cc?auto=format&fit=crop&w=900&q=85', imageAlt: 'Mueble auxiliar de madera junto a una cama' },
  { id: 'demo-07', name: 'Aparador Costa', category: 'Almacenamiento', price: 2190000, available: true, description: 'Almacenamiento práctico con una presencia serena y materiales cálidos.', image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=900&q=85', imageAlt: 'Aparador de madera en interior luminoso' },
  { id: 'demo-08', name: 'Espejo Horizonte', category: 'Decoración', price: 379000, available: true, description: 'Una pieza sencilla que aporta luz y amplitud a cualquier espacio.', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=85', imageAlt: 'Espejo decorativo en habitación de tonos neutros' },
]

export async function getProducts(): Promise<Product[]> {
  // Replace this function with the approved backend integration when available.
  await new Promise((resolve) => window.setTimeout(resolve, 450))
  return demoProducts
}
