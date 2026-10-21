# EcomPacific frontend

Aplicación React con Vite que incluye el formulario de inicio de sesión y el catálogo público de productos.

## Requisitos

- Node.js 18 o superior.
- Backend disponible en `http://localhost:3000/api`, o la URL configurada en `VITE_API_URL`.

## Instalación y ejecución

```bash
npm install
```

Copia `.env.example` a `.env` y ajusta `VITE_API_URL` si la API usa otra dirección. Luego inicia Vite:

```bash
npm run dev
```

El formulario de inicio de sesión se muestra al abrir la aplicación. Usa el enlace “Explorar el catálogo” o abre `/#productos` para ver los productos.

## Funcionalidad

- Inicio de sesión conectado a `POST /auth/login`; los tokens se conservan solo en memoria.
- Catálogo conectado a `GET /products`, con búsqueda por nombre, descripción y categoría.
- Vista de detalle conectada a `GET /products/:id`.
- Estados de carga, error de conexión/servidor, catálogo vacío y búsqueda sin resultados.
- Alternativa visual para productos sin imagen o con una URL de imagen que falle.

## Comprobaciones

```bash
npm test
npm run build
```
