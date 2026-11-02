# EcomPacific — Frontend

Frontend de EcomPacific para consultar el catálogo, ver detalles de productos e iniciar sesión en el dashboard.

## Tecnologías

- React 18 y TypeScript
- Vite
- CSS adaptable, sin librerías adicionales de interfaz
- Fetch API para consumir el backend

## Requisitos

- Node.js 18 o superior
- npm
- Backend EcomPacific en ejecución para cargar productos reales

## Instalación y ejecución

Desde esta carpeta (`frontend/`):

```bash
npm install
```

Copia `.env.example` a `.env` si necesitas cambiar el destino del proxy de desarrollo. Por defecto, Vite redirige las peticiones `/api` a `http://localhost:3000`, que es el puerto configurado en el backend.

```bash
npm run dev
```

Abre la dirección local que indique Vite, normalmente `http://localhost:5173`. Para crear y previsualizar la compilación:

```bash
npm run build
npm run preview
```

## Variables de entorno

| Variable | Uso |
|---|---|
| `VITE_API_PROXY_TARGET` | Host del backend para el proxy local de Vite. Valor de ejemplo: `http://localhost:3000`. |
| `VITE_API_URL` | URL base de la API para un despliegue sin proxy; debe incluir el prefijo, por ejemplo `https://servidor/api`. |

Las variables `VITE_*` se incorporan al cliente. No guardes secretos ni credenciales en ellas.

## Integración con el backend

El dashboard consulta `GET /api/productos`. En desarrollo, la petición pasa por el proxy de Vite. El servicio espera la envoltura `{ success, data, timestamp, path }` que crea el interceptor global del backend, y toma los productos de `data`.

El DTO público de producto contiene `id`, `nombre`, `imagenUrl`, `precio` y `disponible`. La búsqueda por nombre y el orden por precio se aplican en el navegador sobre los productos cargados. Los endpoints de consulta de productos no usan guard de autenticación actualmente.

## Limitaciones conocidas del backend

- No se encontró un endpoint de categorías ni una relación de categoría incluida en el DTO público; por eso el dashboard no muestra filtros de categoría.
- El DTO excluye descripción y stock; la interfaz no presenta esos campos.
- El detalle usa `GET /api/productos/:id`. El DTO publico entrega los mismos campos basicos del catálogo; descripcion, categoria y stock no se exponen.
- En despliegues donde frontend y backend usan orígenes distintos, el equipo debe configurar `CORS_ORIGIN` en el backend para permitir el dominio del frontend. El proxy de Vite cubre el flujo local de desarrollo.
- Si el backend no está ejecutándose o la base de datos no contiene productos activos, la interfaz muestra el error o el estado vacío correspondiente. No se usan datos ficticios.

## Funcionalidades incluidas

- Catálogo responsive con datos reales de la API.
- Búsqueda local por nombre y orden por precio.
- Estados de carga, error recuperable, catálogo vacío y búsqueda sin coincidencias.
- Indicador de disponibilidad y marcador visual si falta o falla una imagen.
- Navegación por teclado, etiquetas accesibles y respeto por la preferencia de movimiento reducido.

## Rutas y autenticación

- `/` muestra el catálogo y consume `GET /api/productos`.
- `/productos/:id` consulta `GET /api/productos/:id`.
- `/login` envía `POST /api/auth/login` con `{ email, password }`. El backend devuelve `{ accessToken, refreshToken, usuario }` dentro del sobre estándar `{ success, data, timestamp, path }`.
- La sesión se conserva en `sessionStorage` y `/dashboard` requiere esa sesión. Al cerrar sesión se eliminan los tokens del navegador.

## Publicacion en Vercel

1. Importa el repositorio y configura `frontend` como **Root Directory**.
2. Usa `npm run build` como comando de build y `dist` como directorio de salida.
3. Define `VITE_API_URL` con la URL pública base del backend, incluyendo el prefijo de API (por ejemplo, `https://api.tu-dominio.com/api`). No incluyas credenciales; Vite expone las variables `VITE_*` al navegador.
4. En el backend, configura `CORS_ORIGIN` para permitir el dominio asignado al frontend.
5. `vercel.json` reescribe las rutas de la SPA a `index.html`, para que `/login`, `/dashboard` y `/productos/:id` abran también al recargar.
6. Después del deploy, comprueba catálogo, detalle, login y recarga directa de cada ruta contra el backend publicado.

En desarrollo, Vite conserva el proxy `/api` hacia `VITE_API_PROXY_TARGET` (por defecto `http://localhost:3000`). Ese valor solo se usa en el servidor local de desarrollo; en producción se debe definir `VITE_API_URL`.