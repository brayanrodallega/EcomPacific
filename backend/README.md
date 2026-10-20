# EcomPacific - Backend

Backend para la tienda online EcomPacific. API REST construida con NestJS, TypeScript, Sequelize y MySQL.

## 📋 Tabla de Contenidos

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
- [Autenticación](#autenticación)
- [Testing](#testing)
- [Scripts Disponibles](#scripts-disponibles)
- [Convenciones](#convenciones)

---

## 🛠 Stack Tecnológico

| Tecnología            | Versión | Propósito                    |
| --------------------- | ------- | ---------------------------- |
| **NestJS**            | 10.x    | Framework Node.js modular    |
| **TypeScript**        | 5.x     | Tipado estático              |
| **Sequelize**         | 6.x     | ORM para MySQL               |
| **MySQL**             | 8.x     | Base de datos relacional     |
| **JWT**               | -       | Autenticación stateless      |
| **Passport**          | -       | Estrategias de autenticación |
| **class-validator**   | -       | Validación de DTOs           |
| **class-transformer** | -       | Transformación de objetos    |
| **Swagger**           | 7.x     | Documentación API            |
| **Jest**              | 29.x    | Testing unitario y e2e       |
| **ESLint + Prettier** | -       | Linting y formateo           |

---

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
├── guards/          # JwtAuthGuard, RolesGuard
├── interceptors/    # TransformResponseInterceptor
├── pipes/           # ValidationPipe, ParseIntPipe
└── decorators/      # @Public(), @Roles(), @CurrentUser()
```

### Flujo de Request

```
Request
  → Middleware (Logger)
  → Guard (JwtAuthGuard)        // Valida JWT, adjunta req.user
  → Guard (RolesGuard)          // Valida @Roles()
  → Pipe (ValidationPipe)       // Valida DTO (class-validator)
  → Controller                  // Recibe request, llama Service
  → Service                     // Lógica negocio, llama Repository
  → Repository                  // Queries Sequelize
  → Entity (Model)              // Definición tabla BD
  ← Service                     // Retorna entidad/DTO
  ← Controller                  // Retorna DTO respuesta
  → Interceptor                 // Envuelve: { success, data, timestamp, path }
  → Response JSON
```

---

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
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── pipes/
│   │   └── decorators/
│   ├── modules/                   # Módulos de funcionalidad
│   │   ├── autenticacion/         # Login, register, refresh, JWT
│   │   ├── usuarios/              # CRUD usuarios + roles
│   │   ├── productos/             # Catálogo productos
│   │   ├── categorias/            # Gestión categorías
│   │   ├── ordenes/               # Órdenes de compra
│   │   ├── carrito/               # Carrito de compras
│   │   └── compartido/            # DatabaseModule (Sequelize)
│   └── utils/
│       ├── responses/             # Exceptions personalizadas
│       ├── validators/
│       ├── functions/
│       └── logger.enum.ts
├── test/                          # Tests Jest (unit + e2e)

├── src/migrations/                # Migraciones Sequelize
├── src/config/database.config.js  # Config Sequelize CLI
├── .sequelizerc                   # Config rutas Sequelize CLI
├── .env.example                   # Variables de entorno ejemplo
├── package.json
├── tsconfig.json
├── nest-cli.json
├── .eslintrc.js
├── .prettierrc
└── .gitignore
```

---

## ✅ Requisitos Previos

- **Node.js** >= 18.x
- **npm** >= 9.x
- **MySQL** >= 8.x (o MariaDB 10.x)
- **MySQL Workbench** (opcional, para gestión visual)

---

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

# JWT (mínimo 32 caracteres cada uno)
JWT_SECRET=tu_secret_super_seguro_de_32_caracteres_minimo
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=otro_secret_diferente_de_32_caracteres_minimo
JWT_REFRESH_EXPIRES_IN=7d

# Bcrypt
BCRYPT_ROUNDS=10

# CORS
CORS_ORIGIN=http://localhost:4200

# Swagger
SWAGGER_ENABLED=true
SWAGGER_PATH=docs
```

> **Generar secrets JWT seguros:**
>
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

---

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

- `usuarios`
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

## 📚 Documentación API

### Swagger UI

Disponible en: **http://localhost:3000/docs**

Incluye:

- Todos los endpoints con parámetros
- Esquemas de request/response
- Autenticación Bearer JWT
- Ejemplos de uso

### Exportar para Postman

1. Abre http://localhost:3000/docs
2. Click **Download** → `openapi.json`
3. En Postman: **Import** → File → `openapi.json`

---

## 🔗 Endpoints Principales

### Autenticación (Público)

| Método | Endpoint             | Descripción          |
| ------ | -------------------- | -------------------- |
| POST   | `/api/auth/register` | Registrar usuario    |
| POST   | `/api/auth/login`    | Iniciar sesión       |
| POST   | `/api/auth/refresh`  | Renovar access token |

### Productos (Público)

| Método | Endpoint                       | Descripción              |
| ------ | ------------------------------ | ------------------------ |
| GET    | `/api/productos`               | Listar productos activos |
| GET    | `/api/productos?categoriaId=1` | Filtrar por categoría    |
| GET    | `/api/productos/:id`           | Obtener producto por ID  |

### Usuarios (Protegido + Roles)

| Método | Endpoint                  | Roles           | Descripción        |
| ------ | ------------------------- | --------------- | ------------------ |
| GET    | `/api/usuarios`           | ADMIN, VENDEDOR | Listar usuarios    |
| GET    | `/api/usuarios/:id`       | ADMIN, VENDEDOR | Obtener usuario    |
| POST   | `/api/usuarios`           | ADMIN           | Crear usuario      |
| PUT    | `/api/usuarios/:id`       | ADMIN           | Actualizar usuario |
| DELETE | `/api/usuarios/:id`       | ADMIN           | Eliminar usuario   |
| GET    | `/api/usuarios/perfil/me` | Todos           | Mi perfil          |

### Categorías (Placeholder)

| Método | Endpoint          | Descripción       |
| ------ | ----------------- | ----------------- |
| GET    | `/api/categorias` | Listar categorías |

### Órdenes (Placeholder)

| Método | Endpoint       | Descripción    |
| ------ | -------------- | -------------- |
| GET    | `/api/ordenes` | Listar órdenes |

### Carrito (Placeholder)

| Método | Endpoint       | Descripción |
| ------ | -------------- | ----------- |
| GET    | `/api/carrito` | Ver carrito |

---

## 🔐 Autenticación

### JWT Strategy

- **Access Token:** 15 min (configurable `JWT_EXPIRES_IN`)
- **Refresh Token:** 7 días (configurable `JWT_REFRESH_EXPIRES_IN`)
- **Algoritmo:** HS256

### Headers Requeridos

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Roles Disponibles

```typescript
enum UserRole {
  ADMIN = 'ADMIN',
  VENDEDOR = 'VENDEDOR',
  CLIENTE = 'CLIENTE',
}
```

### Proteger Endpoints

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.VENDEDOR)
@Get()
async findAll() { ... }

// Endpoint público
@Public()
@Get('publico')
async publico() { ... }

// Usuario actual
@Get('me')
async me(@CurrentUser() user: JwtPayload) { ... }
```

### Flujo de Tokens

```
1. POST /api/auth/login
   → { accessToken, refreshToken, user }

2. Usar accessToken en Authorization header

3. Cuando expire (15 min):
   POST /api/auth/refresh
   Body: { refreshToken }
   → { accessToken, refreshToken } (nuevos)
```

---

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

## 📜 Scripts Disponibles

```json
{
  "start": "nest start", // Producción
  "start:dev": "nest start --watch", // Desarrollo con hot reload
  "start:debug": "nest start --debug --watch", // Debug
  "start:prod": "node dist/main", // Producción compilada
  "build": "nest build", // Compilar TypeScript
  "prebuild": "rimraf dist", // Limpiar dist antes de build

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

## 📝 Convenciones

### Nomenclatura

| Elemento      | Convención        | Ejemplo             |
| ------------- | ----------------- | ------------------- |
| Archivos      | kebab-case        | `user.entity.ts`    |
| Clases        | PascalCase        | `UsuarioRepository` |
| Métodos/Props | camelCase         | `findByEmail()`     |
| Constantes    | UPPER_SNAKE       | `MAX_RETRIES`       |
| Enums         | PascalCase        | `UserRole`          |
| Tablas BD     | snake_case plural | `usuarios`          |
| Columnas BD   | snake_case        | `creado_en`         |

### DTOs

- **Create:** `CreateProductoDto` (todos required)
- **Update:** `UpdateProductoDto` extends `PartialType(CreateProductoDto)`
- **Response:** `ProductoResponseDto` (transforma entidad → público)

### Respuestas API (Estándar)

**Éxito:**

```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2026-10-20T02:31:00.123Z",
  "path": "/api/productos"
}
```

**Error:**

```json
{
  "success": false,
  "message": "Error de validación",
  "errors": {
    "email": ["El email es obligatorio"],
    "password": ["La contraseña debe tener al menos 6 caracteres"]
  },
  "timestamp": "2026-10-20T02:31:00.123Z",
  "path": "/api/auth/login"
}
```

### Validaciones

- **DTOs:** `class-validator` + `class-transformer`
- **Pipe global:** `ValidationPipe` (whitelist, transform, forbidNonWhitelisted)
- **Mensajes:** En español, descriptivos

---

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
- **Autenticación:** JWT + Passport
- **Documentación:** Swagger/OpenAPI 3.0

---
