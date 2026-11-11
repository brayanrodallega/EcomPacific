# EcomPacific - Backend

API REST para la tienda online EcomPacific. Construida con NestJS, TypeScript, Sequelize y MySQL.

## 📑 Tabla de Contenido

- [Stack Tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Base de Datos](#base-de-datos)
- [Administrador Inicial](#administrador-inicial)
- [Ejecución](#ejecución)
- [Endpoints](#endpoints)
- [Reglas de Negocio](#reglas-de-negocio)
- [Testing](#testing)
- [Scripts Disponibles](#scripts-disponibles)
- [Convenciones](#convenciones)
- [Troubleshooting](#troubleshooting)

---

<a id="stack-tecnológico"></a>

## 🛠 Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **NestJS** | 10.x | Framework Node.js modular |
| **TypeScript** | 5.x | Tipado estático |
| **Sequelize** | 6.x | ORM para MySQL |
| **MySQL** | 8.x | Base de datos relacional |
| **class-validator** | 0.14.x | Validación de DTOs |
| **class-transformer** | 0.5.x | Transformación de objetos |
| **Swagger** | 7.x | Documentación API |
| **Jest** | 29.x | Testing |
| **ESLint + Prettier** | - | Linting y formateo |

---

<a id="arquitectura"></a>

## 🏗 Arquitectura

### Patrón: Arquitectura Modular (NestJS)

Cada funcionalidad de negocio es un módulo independiente que encapsula sus capas:

```
src/modules/{modulo}/
├── controllers/     # Capa HTTP
├── services/        # Lógica de negocio
├── repositories/    # Acceso a datos
├── entities/        # Modelos Sequelize
├── dto/             # DTOs + validación
├── interfaces/      # Contratos TypeScript
├── guards/          # Guards del módulo
├── strategies/      # Estrategias Passport
└── {modulo}.module.ts
```

### Capas Transversales (Core)

```
src/core/
├── interceptors/    # TransformResponseInterceptor
├── pipes/           # ValidationPipe
├── decorators/      # @Public(), @Roles(), @CurrentUser()
└── filters/         # GlobalExceptionFilter
```

### Flujo de Request

```
Request
  → Middleware (Logger)
  → Guard (JwtAuthGuard)        # Valida JWT, adjunta req.user
  → Guard (RolesGuard)          # Valida @Roles()
  → Pipe (ValidationPipe)       # Valida DTO
  → Controller                  # Recibe request, llama Service
  → Service                     # Lógica de negocio, llama Repository
  → Repository                  # Queries Sequelize
  → Entity                      # Modelo de tabla
  ← Controller                  # Retorna DTO
  → Interceptor                 # Envuelve: { success, data, timestamp, path }
  → Response JSON
```

---

<a id="estructura-del-proyecto"></a>

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── app.module.ts              # Módulo raíz
│   ├── main.ts                    # Bootstrap + configuración global
│   ├── config/configuracion.ts    # Config tipada con Zod
│   ├── middlewares/               # Logger de requests
│   ├── core/                      # Interceptores, filtros, pipes, decoradores
│   ├── modules/
│   │   ├── productos/             # Catálogo, creación y edición ✅
│   │   ├── autenticacion/         # Login, JWT, roles ✅
│   │   ├── categorias/            # Solo entidad (pendiente)
│   │   └── compartido/            # DatabaseModule (Sequelize)
│   ├── migrations/                # Migraciones Sequelize
│   └── config/database.config.js  # Config Sequelize CLI
├── test/                          # Configuración Jest (sin specs aún)
├── .env.example
├── package.json
└── tsconfig.json
```

---

<a id="requisitos-previos"></a>

## ✅ Requisitos Previos

- **Node.js** >= 18.x
- **npm** >= 9.x
- **MySQL** >= 8.x (o MariaDB 10.x)
- **MySQL Workbench** (opcional)

---

<a id="instalación"></a>

## 📦 Instalación

```bash
cd backend
npm install
cp .env.example .env
# Editar .env con las credenciales reales
```

---

<a id="configuración"></a>

## ⚙️ Configuración

```env
# App
NODE_ENV=development
PORT=3000
API_PREFIX=api

# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password_mysql
DB_NAME=ecompacific

# JWT
JWT_SECRET=tu_secret_de_al_menos_32_caracteres
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=otro_secret_de_al_menos_32_caracteres
JWT_REFRESH_EXPIRES_IN=7d

# Bcrypt
BCRYPT_ROUNDS=10

# CORS
CORS_ORIGIN=http://localhost:4200

# Swagger
SWAGGER_ENABLED=true
SWAGGER_PATH=docs
```

> Las variables JWT deben tener **32 caracteres o más**. El servidor no arranca si faltan.

---

<a id="base-de-datos"></a>

## 🗄 Base de Datos

### Migraciones (Sequelize CLI)

```bash
npm run migration:create --name=nombre-migracion   # Crear
npm run db:migrate                                 # Ejecutar pendientes
npm run db:migrate:undo                            # Revertir última
npx sequelize-cli db:migrate:status                # Ver estado
```

### Tablas existentes

| Tabla | Descripción |
|-------|-------------|
| `categorias` | Categorías de productos (`nombre` único) |
| `productos` | Catálogo. FK `categoria_id` → `categorias` (`ON UPDATE CASCADE`, `ON DELETE RESTRICT`) |
| `usuarios` | Cuentas y roles. Incluye `intentos_login`, `ultimo_login_fallido`, `bloqueado_hasta`, `refresh_token` |

### Tablas planificadas (aún no existen)

- `carritos`, `carrito_items`
- `ordenes`, `orden_items`

> `synchronize: true` está activo solo en desarrollo. En producción se usan migraciones.

---

<a id="administrador-inicial"></a>

## 👤 Administrador Inicial

**No existe registro público de administradores.** El primer admin se crea manualmente.

```bash
# 1. Generar el hash de la contraseña
node -e "console.log(require('bcrypt').hashSync('TuPasswordSegura', 10))"
```

```sql
-- 2. Insertar el usuario con rol ADMIN
INSERT INTO usuarios (nombre, email, password, rol, activo, creado_en, actualizado_en)
VALUES ('Administrador', 'admin@ejemplo.com', '<HASH_GENERADO>', 'ADMIN', 1, NOW(), NOW());
```

Luego se inicia sesión normalmente con `POST /api/auth/login`.

> La contraseña del administrador **no debe** quedar en el repositorio.

---

<a id="ejecución"></a>

## 🚀 Ejecución

```bash
# Desarrollo (watch)
npm run start:dev

# Producción
npm run build
npm run start:prod
```

> La salida real del build es `dist/src/main.js`; `start:prod` ya apunta a esa ruta.

### Verificar que funciona

- **API:** http://localhost:3000/api
- **Swagger:** http://localhost:3000/docs
- **Catálogo:** http://localhost:3000/api/productos

---

<a id="endpoints"></a>

## 🔗 Endpoints

### Resumen

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/productos` | Catálogo de productos activos | Público |
| GET | `/api/productos/:id` | Detalle público de un producto | Público |
| GET | `/api/productos/admin` | Listado completo, incluidos inactivos | ADMIN |
| GET | `/api/productos/:id/detalle` | Detalle completo para el formulario admin | ADMIN |
| POST | `/api/productos` | Crear producto | ADMIN |
| PATCH | `/api/productos/:id` | Actualizar producto | ADMIN |
| POST | `/api/auth/login` | Iniciar sesión | Público |
| POST | `/api/auth/register` | Registrar usuario | Público |
| POST | `/api/auth/refresh` | Renovar access token | Público |
| POST | `/api/auth/logout` | Cerrar sesión | Autenticado |
| GET | `/api/auth/me` | Perfil del usuario actual | Autenticado |

---

### HU-01 — Catálogo público

#### `GET /api/productos`

Devuelve solo productos con `activo = true`, ordenados por fecha de creación descendente.

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Teclado Mecánico RGB",
      "imagenUrl": "https://ejemplo.com/teclado.jpg",
      "precio": 240000,
      "disponible": true
    }
  ],
  "timestamp": "2026-10-24T16:00:00.000Z",
  "path": "/api/productos"
}
```

#### `GET /api/productos/:id`

- `200` con el producto.
- `404` si no existe **o si está inactivo**.

Campos públicos: `id`, `nombre`, `imagenUrl`, `precio`, `disponible`.
`disponible = activo && stock > 0`.

---

### HU-04 — Crear producto

#### `POST /api/productos`

Requiere `Authorization: Bearer <token>` de un usuario con rol `ADMIN`.

```json
{
  "nombre": "Laptop Gaming",
  "descripcion": "Laptop para gaming de alto rendimiento",
  "precio": 2500000,
  "stock": 10,
  "imagenUrl": "https://ejemplo.com/laptop.jpg",
  "categoriaId": 1,
  "activo": true
}
```

**Respuesta `201`:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "nombre": "Laptop Gaming",
    "descripcion": "Laptop para gaming de alto rendimiento",
    "precio": 2500000,
    "stock": 10,
    "imagenUrl": "https://ejemplo.com/laptop.jpg",
    "categoriaId": 1,
    "activo": true,
    "disponible": true,
    "creadoEn": "2026-10-24T16:00:00.000Z",
    "actualizadoEn": "2026-10-24T16:00:00.000Z"
  },
  "timestamp": "2026-10-24T16:00:00.000Z",
  "path": "/api/productos"
}
```

**Errores de validación `400`:**

```json
{
  "success": false,
  "message": "Datos de entrada inválidos",
  "errors": {
    "nombre": ["El nombre es obligatorio"],
    "precio": ["El precio debe ser un número positivo"],
    "stock": ["El stock no puede ser negativo"],
    "imagenUrl": ["La URL de la imagen debe tener un formato válido"],
    "categoriaId": ["La categoría con ID 99 no existe"]
  },
  "timestamp": "2026-10-24T16:00:00.000Z",
  "path": "/api/productos"
}
```

---

### HU-05 — Actualizar producto

#### `GET /api/productos/admin`

Requiere rol `ADMIN`. Devuelve **todos** los productos, activos e inactivos,
ordenados por fecha de creación descendente. Cada elemento usa `ProductoDetalleDto`,
igual que el detalle individual.

Sirve para que el panel administrativo pueda encontrar y reactivar un producto
desactivado, ya que el catálogo público (`GET /api/productos`) los oculta.

- `200` con `ProductoDetalleDto[]`.
- `401` sin token.
- `403` sin rol `ADMIN`.

> La ruta `/api/productos/admin` está declarada antes de `/api/productos/:id`
> para que `admin` no se interprete como un `id`.

#### `GET /api/productos/:id/detalle`

Requiere rol `ADMIN`. Devuelve **todos** los campos del producto, incluidos los que
el catálogo público no expone: `descripcion`, `stock`, `activo` y `categoriaId`.

Se usa para precargar el formulario de edición. A diferencia del `GET :id` público,
**funciona también con productos inactivos**, para poder reactivarlos.

- `200` con `ProductoDetalleDto`.
- `401` sin token.
- `403` sin rol `ADMIN`.
- `404` si el producto no existe.

#### `PATCH /api/productos/:id`

Requiere rol `ADMIN`. Todos los campos son opcionales, pero conservan las
validaciones de creación.

```json
{
  "precio": 2600000,
  "stock": 8
}
```

**Respuesta `200`:** misma estructura que la creación, con `actualizadoEn` renovado.

**Reglas:**

- Solo se modifican los campos enviados.
- Campos permitidos: `nombre`, `descripcion`, `precio`, `stock`, `imagenUrl`,
  `categoriaId`, `activo`.
- `id`, `creadoEn` y `actualizadoEn` no se pueden modificar (el `ValidationPipe`
  rechaza campos no declarados).
- Si el producto no existe: `404 Producto con ID X no encontrado`.
- Body vacío: `400 No se enviaron campos para actualizar`.
- Si `categoriaId` no existe: `400` con `errors.categoriaId`.
- No hay `DELETE`: para retirar un producto del catálogo se envía `{ "activo": false }`.

**Códigos de respuesta:**

| Código | Caso |
|--------|------|
| `200` | Actualizado |
| `400` | Validación fallida o body vacío |
| `401` | Sin token o token inválido |
| `403` | Usuario sin rol `ADMIN` |
| `404` | Producto inexistente |

---

### HU-03 — Autenticación

#### `POST /api/auth/login`

```json
{
  "email": "admin@ecompacific.com",
  "password": "TuPasswordSegura"
}
```

**Respuesta `200`:**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi...",
    "usuario": {
      "id": 1,
      "email": "admin@ecompacific.com",
      "nombre": "Administrador",
      "rol": "ADMIN"
    }
  },
  "timestamp": "2026-10-24T16:00:00.000Z",
  "path": "/api/auth/login"
}
```

**Seguridad:**

- Contraseñas con bcrypt (10 rounds).
- Mensaje genérico `Credenciales inválidas`: no revela si el correo existe.
- Se ejecuta una comparación bcrypt ficticia cuando el usuario no existe,
  para evitar enumeración por tiempo de respuesta.
- **Bloqueo:** 5 intentos fallidos → cuenta bloqueada 15 minutos.
  Del 6.º intento en adelante: `Cuenta bloqueada temporalmente. Intente más tarde.`
- Un login exitoso reinicia el contador y limpia `bloqueado_hasta`.
- Al expirar el bloqueo, el contador se reinicia automáticamente: el usuario
  recupera sus 5 intentos. Un solo fallo después del bloqueo ya no lo vuelve a
  bloquear 15 minutos.
- **Rate limiting:** 20 solicitudes por minuto solo en este endpoint. Al excederlo:
  `429 Demasiadas solicitudes. Intente más tarde.`

#### `POST /api/auth/register`

```json
{
  "nombre": "Juan",
  "email": "juan@ejemplo.com",
  "password": "Password123"
}
```

El rol se asigna automáticamente como `CLIENTE`. El body **no acepta** `rol`:
si se envía, la respuesta es `400` (`El campo rol no está permitido`).
Los administradores se crean solo con el procedimiento manual descrito arriba.

#### `POST /api/auth/refresh`

```json
{ "refreshToken": "eyJhbGciOi..." }
```

Rota el refresh token: el anterior deja de ser válido.

#### `POST /api/auth/logout`

Requiere `Authorization: Bearer <accessToken>`. Elimina el refresh token de la BD.

#### `GET /api/auth/me`

Requiere `Authorization: Bearer <accessToken>`. Devuelve el perfil sin contraseña.

**Limitación de revocación:** el logout invalida el refresh token, pero el access
token sigue siendo válido hasta expirar (máximo 15 minutos). No hay lista negra
de tokens; la revocación inmediata requeriría almacenar los JWT emitidos.

---

<a id="reglas-de-negocio"></a>

## 📌 Reglas de Negocio

### Protección del historial de pedidos

Editar un producto **no debe alterar** el nombre ni el precio de pedidos ya registrados.

Para garantizarlo, las líneas de pedido guardarán una copia inmutable al momento
de la compra:

| Campo | Propósito |
|-------|-----------|
| `producto_id` | Referencia suave al catálogo actual |
| `nombre_producto` | Copia del nombre al momento de la compra |
| `precio_unitario` | Copia del precio al momento de la compra |

Reglas asociadas:

- Los pedidos históricos se muestran leyendo **esas copias**, nunca con un `JOIN`
  a `productos`.
- No se permite `ON UPDATE CASCADE` desde `orden_items` hacia `productos`.
- Los productos no se eliminan físicamente: se desactivan con `activo = false`.
- Editar un producto escribe únicamente en `productos`.

> Estado: el módulo de órdenes aún no existe, por lo que esta regla está definida
> por diseño pero todavía no es verificable en ejecución.

### Campos actualizables de un producto

- Permitidos: `nombre`, `descripcion`, `precio`, `stock`, `imagenUrl`, `categoriaId`, `activo`.
- Prohibidos: `id`, `creadoEn`, `actualizadoEn`.
- Sin `upsert` ni `findOrCreate`: si el producto no existe, se responde `404`.

---

<a id="testing"></a>

## 🧪 Testing

```bash
npm run test        # Unitarios
npm run test:watch  # Watch mode
npm run test:cov    # Cobertura
npm run test:e2e    # End-to-end
```

Estado actual: la configuración de Jest existe, pero **no hay specs escritos**.
Las historias HU-01 a HU-05 se verificaron manualmente con Swagger, Postman e
`Invoke-RestMethod`.

---

<a id="scripts-disponibles"></a>

## 📜 Scripts Disponibles

```json
{
  "start": "nest start",
  "start:dev": "nest start --watch",
  "start:debug": "nest start --debug --watch",
  "start:prod": "node dist/main",
  "build": "nest build",
  "prebuild": "rimraf dist",
  "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
  "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
  "test": "jest --config ./test/jest.json",
  "test:watch": "jest --watch",
  "test:cov": "jest --coverage",
  "test:e2e": "jest --config ./test/jest-e2e.json",
  "db:migrate": "sequelize-cli db:migrate",
  "db:migrate:undo": "sequelize-cli db:migrate:undo",
  "migration:create": "sequelize-cli migration:generate --name"
}
```

---

<a id="convenciones"></a>

## 📝 Convenciones

### Nomenclatura

| Elemento | Convención | Ejemplo |
|----------|------------|---------|
| Archivos | kebab-case | `crear-producto.dto.ts` |
| Clases | PascalCase | `ProductoRepository` |
| Métodos/Props | camelCase | `actualizarProducto()` |
| Constantes | UPPER_SNAKE | `MAX_INTENTOS` |
| Enums | PascalCase | `UserRole` |
| Tablas BD | snake_case plural | `productos` |
| Columnas BD | snake_case | `creado_en` |

### DTOs

- **Entrada:** `CrearProductoDto`, `ActualizarProductoDto` (`PartialType` del anterior)
- **Salida pública:** `ProductoResponseDto` (solo campos públicos)
- **Salida administrativa:** `ProductoDetalleDto` (todos los campos)

### Validaciones

- `class-validator` + `class-transformer`
- `ValidationPipe` global con `whitelist`, `transform` y `forbidNonWhitelisted`
- Mensajes en español, por campo

### Respuestas API

**Éxito:**

```json
{
  "success": true,
  "data": { },
  "timestamp": "2026-10-24T16:00:00.000Z",
  "path": "/api/productos"
}
```

**Error:**

```json
{
  "success": false,
  "message": "Datos de entrada inválidos",
  "errors": { "campo": ["mensaje de error"] },
  "timestamp": "2026-10-24T16:00:00.000Z",
  "path": "/api/productos"
}
```

---

<a id="troubleshooting"></a>

## 🐛 Troubleshooting

### Puerto en uso (EADDRINUSE)

```bash
# Windows
taskkill /F /IM node.exe

# Linux/Mac
killall node
```

### Error JWT_SECRET inválido

- Verificar que `JWT_SECRET` y `JWT_REFRESH_SECRET` tengan 32+ caracteres.
- Reiniciar el servidor tras cambiar `.env`.

### Migraciones fallan

```bash
mysql -u root -p -e "SHOW DATABASES;"
mysql -u root -p -e "USE ecompacific; SHOW TABLES;"
mysql -u root -p -e "DROP DATABASE ecompacific; CREATE DATABASE ecompacific;"
npm run db:migrate
```

### `curl` en PowerShell

`curl` es alias de `Invoke-WebRequest`, que no acepta `-H` ni `-d` igual que curl.
Usar `curl.exe` o, mejor, `Invoke-RestMethod`:

```powershell
$body  = @{ email = 'admin@ecompacific.com'; password = 'TuPasswordSegura' } | ConvertTo-Json
$login = Invoke-RestMethod -Uri 'http://localhost:3000/api/auth/login' -Method Post `
  -ContentType 'application/json' -Body $body
$h = @{ Authorization = "Bearer $($login.data.accessToken)" }

Invoke-RestMethod -Uri 'http://localhost:3000/api/productos/1' -Method Patch `
  -ContentType 'application/json' -Headers $h -Body '{"stock":8}'
```

### Cuenta bloqueada por intentos fallidos

```sql
UPDATE usuarios SET intentos_login = 0, bloqueado_hasta = NULL
WHERE email = 'admin@ecompacific.com';
```

---

## 📄 Licencia

ISC - Proyecto académico EcomPacific

---

*Última actualización: 24 de octubre de 2026*
