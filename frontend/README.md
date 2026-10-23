# EcomPacific — Frontend

Dashboard web para consultar el catálogo real que expone el backend de EcomPacific. Esta fase cubre solo la vista pública de productos; no incluye autenticación, carrito, pagos ni administración.

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
- No se añadió una vista de detalle: el endpoint por ID devuelve el mismo DTO público y no aporta más información al catálogo actual.
- En despliegues donde frontend y backend usan orígenes distintos, el equipo debe configurar `CORS_ORIGIN` en el backend para permitir el dominio del frontend. El proxy de Vite cubre el flujo local de desarrollo.
- Si el backend no está ejecutándose o la base de datos no contiene productos activos, la interfaz muestra el error o el estado vacío correspondiente. No se usan datos ficticios.

## Funcionalidades incluidas

- Catálogo responsive con datos reales de la API.
- Búsqueda local por nombre y orden por precio.
- Estados de carga, error recuperable, catálogo vacío y búsqueda sin coincidencias.
- Indicador de disponibilidad y marcador visual si falta o falla una imagen.
- Navegación por teclado, etiquetas accesibles y respeto por la preferencia de movimiento reducido.
