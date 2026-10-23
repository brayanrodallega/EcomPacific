# EcomPacific - Backend

Backend para la tienda online EcomPacific. API REST construida con NestJS, TypeScript, Sequelize y MySQL.

## 📑 Tabla de Contenido

- [Stack Tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Base de Datos](#base-de-datos)
- [Ejecución](#ejecución)
- [Documentación API](#documentación-api)
- [Endpoints Principales](#endpoints-principales)
- [Testing](#testing)
- [Scripts Disponibles](#scripts-disponibles)
- [Convenciones](#convenciones)

---

<a id="stack-tecnologico"></a>

## 🛠 Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **NestJS** | 10.x | Framework Node.js modular |
| **TypeScript** | 5.x | Tipado estático |
| **Sequelize** | 6.x | ORM para MySQL |
| **MySQL** | 8.x | Base de datos relacional |
| **class-validator** | - | Validación de DTOs |
| **class-transformer** | - | Transformación de objetos |
| **Swagger** | 7.x | Documentación API |
| **Jest** | 29.x | Testing unitario y e2e |
| **ESLint + Prettier** | - | Linting y formateo |

---

<a id="arquitectura"></a>

## 🏗 Arquitectura

### Patrón: **Arquitectura Modular (NestJS)**

Cada funcionalidad de negocio es un **módulo independiente** que encapsula sus propias capas:

```
src/modules/{modulo}/
├── controllers/     # Capa de presentación (HTTP)
├── services/        # Lógica de negocio
├── repositories/    # Acceso a datos
├── entities/        # Modelos de BD (Sequelize)
├── dto/             # Data Transfer Objects + validación
├── interfaces/      # Contratos TypeScript
├── guards/          # Guards específicos del módulo
├── strategies/      # Estrategias Passport
└── {modulo}.module.ts
```

### Capas Transversales (Core)

```
src/core/
├── interceptors/    # TransformResponseInterceptor
├── pipes/           # ValidationPipe, ParseIntPipe
├── decorators/      # @Public(), @Roles(), @CurrentUser()
└── filters/         # GlobalExceptionFilter
```

### Flujo de Request

```
Request
  → Middleware (Logger)
  → Guard (JwtAuthGuard)        // Valida JWT, adjunta req.user
  → Guard (RolesGuard)          // Valida @Roles()
  → Pipe (ValidationPipe)       // Valida DTO (class-validator)
  → Controller                  # Recibe request, llama Service
  → Service                     # Lógica negocio, llama Repository
  → Repository                  # Queries Sequelize
  → Entity (Model)              # Definición tabla BD
  ← Service                     # Retorna entidad/DTO
  ← Controller                  # Retorna DTO respuesta
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
│   ├── main.ts                    # Bootstrap + config global
│   ├── config/
│   │   └── configuracion.ts       # Config tipada con Zod
│   ├── middlewares/
│   │   └── logger.middleware.ts   # Log de requests HTTP
│   ├── core/                      # Utilidades globales
│   │   ├── interceptors/
│   │   ├── pipes/
│   │   ├── filters/               # GlobalExceptionFilter
│   │   ├── decorators/            # @Public(), @Roles(), @CurrentUser()
│   │   └── guards/                # JwtAuthGuard, RolesGuard, ThrottlerGuard
│   ├── modules/                   # Módulos de funcionalidad
│   │   ├── productos/             # Catálogo productos ✅ IMPLEMENTADO
│   │   ├── autenticacion/         # Login, register, refresh, JWT ✅ IMPLEMENTADO
│   │   ├── usuarios/              # CRUD usuarios + roles (PENDIENTE)
│   │   ├── categorias/            # Gestión categorías (PENDIENTE)
│   │   ├── ordenes/               # Órdenes de compra (PENDIENTE)
│   │   ├── carrito/               # Carrito de compras (PENDIENTE)
│   │   └── compartido/            # DatabaseModule (Sequelize)
│   └── utils/
│       └── logger.enum.ts
├── test/                          # Tests Jest (unit + e2e)
├── src/migrations/                # Migraciones Sequelize
├── src/config/database.config.js  # Config Sequelize CLI
├── .sequelizerc                   # Config rutas Sequelize CLI
├── .env.example                   # Variables de entorno ejemplo
├── package.json
├── tsconfig.json
├── nest-cli.json
└── .gitignore
```

---

<a id="requisitos-previos"></a>

## ✅ Requisitos Previos

- **Node.js** >= 18.x
- **npm** >= 9.x
- **MySQL** >= 8.x (o MariaDB 10.x)
- **MySQL Workbench** (opcional, para gestión visual)

---

<a id="instalación"></a>

## 📦 Instalación

```bash
# 1. Clonar repositorio
cd backend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales reales
```

---

<a id="configuración"></a>

## ⚙️ Configuración

Edita `.env` con tus valores:

```env
# App
NODE_ENV=development
PORT=3000
API_PREFIX=api

# Database (MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password_mysql
DB_NAME=ecompacific

# Bcrypt
BCRYPT_ROUNDS=10

# CORS
CORS_ORIGIN=http://localhost:4200

# Swagger
SWAGGER_ENABLED=true
SWAGGER_PATH=docs
```

---

<a id="base-de-datos"></a>

## 🗄 Base de Datos

### Migraciones (Sequelize CLI)

```bash
# Crear migración
npm run migration:create --name=nombre-migracion

# Ejecutar migraciones pendientes
npm run db:migrate

# Revertir última migración
npm run db:migrate:undo

# Ver estado
npx sequelize-cli db:migrate:status
```

### Migración Inicial (ya incluida)

Crea las tablas:
- `usuarios` (con campos para rate limiting: `intentos_login`, `bloqueado_hasta`, `refresh_token`)
- `categorias`
- `productos`
- `carritos`
- `carrito_items`
- `ordenes`
- `orden_items`

### Sincronización Automática (Desarrollo)

En `DatabaseModule`:
```typescript
synchronize: process.env.NODE_ENV !== 'production',
```
> Solo para desarrollo. En producción **usa migraciones**.

---

<a id="ejecución"></a>

## 🚀 Ejecución

```bash
# Desarrollo (watch mode)
npm run start:dev

# Producción
npm run build
npm run start:prod

# Debug
npm run start:debug
```

### Verificar que funciona

- **API:** http://localhost:3000/api
- **Swagger:** http://localhost:3000/docs
- **Health check:** http://localhost:3000/api/productos

---

<a id="documentación-api"></a>

## 📚 Documentación API

### Swagger UI

Disponible en: **http://localhost:3000/docs**

Incluye:
- Todos los endpoints con parámetros
- Esquemas de request/response
- Ejemplos de uso

### Exportar para Postman
1. Abre http://localhost:3000/docs
2. Click **Download** → `openapi.json`
2. En Postman: **Import** → File → `openapi.json`

---

<a id="endpoints-principales"></a>

## 🔗 Endpoints Principales

### Productos (Público) ✅ IMPLEMENTADO (HU-01)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/productos` | Listar productos activos |
| GET | `/api/productos/:id` | Obtener producto por ID |

### Respuesta Producto (Campos públicos)

```json
{
  "id": 1,
  "nombre": "Laptop Gaming",
  "imagenUrl": "https://ejemplo.com/imagen.jpg",
  "precio": 2500000,
  "disponible": true
}
```

### Gestión de Productos (Admin) ✅ IMPLEMENTADO (HU-04)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/productos` | Registrar nuevo producto | Bearer Token (`rol: ADMIN`) |

#### Body Request `POST /api/productos`:
```json
{
  "nombre": "Laptop Gaming",
  "descripcion": "Laptop para gaming de alto rendimiento",
  "precio": 2500000,
  "stock": 10,
  "imagenUrl": "https://ejemplo.com/imagen.jpg",
  "categoriaId": 1,
  "activo": true
}
```

#### Respuesta Exitosa (201 Created):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nombre": "Laptop Gaming",
    "descripcion": "Laptop para gaming de alto rendimiento",
    "precio": 2500000,
    "stock": 10,
    "imagenUrl": "https://ejemplo.com/imagen.jpg",
    "categoriaId": 1,
    "activo": true,
    "disponible": true,
    "creadoEn": "2026-10-22T...",
    "actualizadoEn": "2026-10-22T..."
  },
  "timestamp": "2026-10-22T...",
  "path": "/api/productos"
}
```

#### Errores de Validación (400 Bad Request):
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
  "timestamp": "2026-10-22T...",
  "path": "/api/productos"
}
```

### Autenticación ✅ IMPLEMENTADO (HU-03)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/auth/register` | Registrar nuevo usuario |
| POST | `/api/auth/refresh` | Renovar access token |
| POST | `/api/auth/logout` | Cerrar sesión (requiere auth) |
| GET | `/api/auth/me` | Obtener usuario actual (requiere auth) |

### Módulos Pendientes 🚧

| Módulo | Endpoints Planificados | Estado |
|--------|------------------------|--------|
| Usuarios | `/api/usuarios` CRUD + roles | 🚧 Pendiente |
| Categorías | `/api/categorias` CRUD | 🚧 Pendiente |
| Órdenes | `/api/ordenes` CRUD | 🚧 Pendiente |
| Carrito | `/api/carrito` CRUD | 🚧 Pendiente |

---

<a id="documentación-api"></a>

## 📚 Documentación API

### Swagger UI

Disponible en: **http://localhost:3000/docs**

Incluye:
- Todos los endpoints con parámetros
- Esquemas de request/response
- Ejemplos de uso

### Exportar para Postman
1. Abre http://localhost:3000/docs
2. Click **Download** → `openapi.json`
3. En Postman: **Import** → File → `openapi.json`

---

<a id="testing"></a>

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests en watch mode
npm run test:watch

# Cobertura
npm run test:cov

# Tests e2e
npm run test:e2e
```

### Estructura de Tests

```
test/
├── jest.json          # Config unit tests
├── jest-e2e.json      # Config e2e tests
├── jest.setup.ts      # Setup global
└── app.e2e-spec.ts    # Tests e2e ejemplo
```

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
| Archivos | kebab-case | `product.entity.ts` |
| Clases | PascalCase | `ProductoRepository` |
| Métodos/Props | camelCase | `findById()` |
| Constantes | UPPER_SNAKE | `MAX_RETRIES` |
| Enums | PascalCase | `UserRole` |
| Tablas BD | snake_case plural | `productos` |
| Columnas BD | snake_case | `creado_en` |

### DTOs

- **Response:** `ProductoResponseDto` (transforma entidad → público, excluye campos internos)

### Respuestas API (Estándar)

**Éxito:**
```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2026-10-21T11:52:01.123Z",
  "path": "/api/productos"
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error de validación",
  "errors": {
    "campo": ["mensaje de error"]
  },
  "timestamp": "2026-10-21T11:52:01.123Z",
  "path": "/api/productos"
}
```

### Validaciones

- **DTOs:** `class-validator` + `class-transformer`
- **Pipe global:** `ValidationPipe` (whitelist, transform, forbidNonWhitelisted)
- **Mensajes:** En español, descriptivos

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
| Archivos | kebab-case | `product.entity.ts` |
| Clases | PascalCase | `ProductoRepository` |
| Métodos/Props | camelCase | `findById()` |
| Constantes | UPPER_SNAKE | `MAX_RETRIES` |
| Enums | PascalCase | `UserRole` |
| Tablas BD | snake_case plural | `productos` |
| Columnas BD | snake_case | `creado_en` |

### DTOs

- **Response:** `ProductoResponseDto` (transforma entidad → público, excluye campos internos)

### Respuestas API (Estándar)

**Éxito:**
```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2026-10-21T11:52:01.123Z",
  "path": "/api/productos"
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error de validación",
  "errors": {
    "campo": ["mensaje de error"]
  },
  "timestamp": "2026-10-21T11:52:01.123Z",
  "path": "/api/productos"
}
```

### Validaciones

- **DTOs:** `class-validator` + `class-transformer`
- **Pipe global:** `ValidationPipe` (whitelist, transform, forbidNonWhitelisted)
- **Mensajes:** En español, descriptivos

---

## 🔄 Agregar Nuevo Módulo

```bash
# 1. Crear estructura
mkdir -p src/modules/nuevo/{controllers,services,repositories,entities,dto,interfaces}

# 2. Crear entidad (Sequelize)
# src/modules/nuevo/entities/nuevo.entity.ts

# 2. Crear repository
# src/modules/nuevo/repositories/nuevo.repository.ts

# 3. Crear service
# src/modules/nuevo/services/nuevo.service.ts

# 4. Crear controller
# src/modules/nuevo/controllers/nuevo.controller.ts

# 5. Crear DTOs
# src/modules/nuevo/dto/

# 6. Crear module
# src/modules/nuevo/nuevo.module.ts

# 7. Registrar en app.module.ts
imports: [NuevoModule, ...]
```

---

## 🐛 Troubleshooting

### Puerto en uso (EADDRINUSE)
```bash
# Windows
taskkill /F /IM node.exe

# Linux/Mac
killall node
```

### Error JWT_SECRET inválido
- Verificar `.env` tiene `JWT_SECRET` y `JWT_REFRESH_SECRET` con 32+ chars
- Reiniciar servidor tras cambios en `.env`

### Migraciones fallan
```bash
# Verificar conexión MySQL
mysql -u root -p -e "SHOW DATABASES;"

# Verificar BD existe
mysql -u root -p -e "USE ecompacific; SHOW TABLES;"

# Recrear BD si necesario
mysql -u root -p -e "DROP DATABASE ecompacific; CREATE DATABASE ecompacific;"
npm run db:migrate
```

### Dependencias no resueltas
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📄 Licencia

ISC - Proyecto académico EcomPacific

---

## 👥 Equipo Backend

- **Arquitectura:** NestJS Modular
- **Base de datos:** MySQL + Sequelize
- **Documentación:** Swagger/OpenAPI 3.0

---

*Última actualización: Octubre 2026*