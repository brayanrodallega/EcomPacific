# HU-02 — Validación del endpoint de detalle de producto

## Endpoint validado

```text
GET /api/productos/:id
```

No requiere autenticación.

## PR de referencia HU-01

- PR: https://github.com/brayanrodallega/EcomPacific/pull/72
- Título: `feat: [HU-01] endpoint público de catálogo con modelo producto-inventario`

## Cambios realizados para cumplir el contrato

El endpoint de detalle devolvía `id`, `nombre`, `imagenUrl`, `precio` y `disponible`, pero faltaban `descripcion` y `categoria`.

Se agregó:

- Entidad `Categoria` (`backend/src/modules/categorias/entities/categoria.entity.ts`).
- Relación `Producto` → `Categoria` por `idCategoria`.
- Inclusión de la categoría en la consulta de detalle.
- DTO `ProductoDetalleRespuestaDto` con `descripcion`, `idCategoria` y `categoria`.

El endpoint de catálogo `GET /api/productos` conserva su contrato original de HU-01.

## Datos de prueba en MySQL

Tabla `producto`:

| idProducto | nombre | activo |
|---:|---|---:|
| 1 | Teclado Mecánico RGB | 1 |
| 2 | Producto Inactivo Oculto | 0 |
| 3 | Producto Agotado | 1 |
| 4 | Laptop Gaming | 1 |

Tabla `inventario`:

| idProducto | cantidadDisponible |
|---:|---:|
| 1 | 15 |
| 2 | 10 |
| 3 | 0 |
| 4 | 10 |

## Resultados de las consultas

### 1. Producto activo con existencias — `GET /api/productos/1`

**Resultado:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": 1,
    "nombre": "Teclado Mecánico RGB",
    "imagenUrl": "https://images.unsplash.com/photo-1587829741301-dc798b83add3",
    "precio": 240000,
    "disponible": true,
    "descripcion": "Teclado switches red con iluminación RGB personalizable y cable extraíble",
    "idCategoria": 1,
    "categoria": "Tecnología"
  },
  "timestamp": "2026-11-24T03:35:27.335Z",
  "path": "/api/productos/1"
}
```

Cumple: nombre, imagen, descripción, categoría, precio y disponibilidad, sin autenticación.

### 2. Producto activo agotado — `GET /api/productos/3`

**Resultado:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": 3,
    "nombre": "Producto Agotado",
    "imagenUrl": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46",
    "precio": 99000,
    "disponible": false,
    "descripcion": "Producto activo pero sin existencias",
    "idCategoria": 1,
    "categoria": "Tecnología"
  },
  "timestamp": "2026-11-24T03:35:27.427Z",
  "path": "/api/productos/3"
}
```

Cumple: el producto agotado se puede consultar y figura como no disponible para compra.

### 3. Producto inactivo — `GET /api/productos/2`

**Resultado:** `404 Not Found`

```json
{
  "message": "Producto con ID 2 no encontrado",
  "error": "Not Found",
  "statusCode": 404
}
```

Cumple: un producto inactivo no se expone en el detalle.

### 4. Producto inexistente — `GET /api/productos/999`

**Resultado:** `404 Not Found`

```json
{
  "message": "Producto con ID 999 no encontrado",
  "error": "Not Found",
  "statusCode": 404
}
```

Cumple: un producto inexistente devuelve 404.

### 5. Catálogo sin autenticación — `GET /api/productos`

**Resultado:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": 4,
      "nombre": "Laptop Gaming",
      "imagenUrl": "https://ejemplo.com/imagen.jpg",
      "precio": 2500000,
      "disponible": true
    },
    {
      "id": 3,
      "nombre": "Producto Agotado",
      "imagenUrl": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46",
      "precio": 99000,
      "disponible": false
    },
    {
      "id": 1,
      "nombre": "Teclado Mecánico RGB",
      "imagenUrl": "https://images.unsplash.com/photo-1587829741301-dc798b83add3",
      "precio": 240000,
      "disponible": true
    }
  ],
  "timestamp": "2026-11-24T03:36:08.133Z",
  "path": "/api/productos"
}
```

Cumple: el catálogo sigue funcionando y no expone el producto inactivo.

## Conclusión

El endpoint `GET /api/productos/:id` cumple el contrato de la pantalla de detalle:

- Producto activo: devuelve nombre, imagen, descripción, categoría, precio y disponibilidad.
- Producto activo agotado: devuelve `200` con `disponible: false`.
- Producto inactivo: devuelve `404`.
- Producto inexistente: devuelve `404`.
- No requiere inicio de sesión.
