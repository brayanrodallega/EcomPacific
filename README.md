# EcomPacific

EcomPacific es una aplicación web académica para una tienda de muebles y artículos para el hogar. El proyecto aplica Scrum con trabajo incremental por sprint y colaboración mediante Git y GitHub.

## Objetivo

Dar a una tienda una presencia web donde las personas puedan consultar productos y donde el equipo pueda construir gradualmente las funciones de administración y operación de la tienda.

## Alcance

| Área | Estado en el código actual |
| --- | --- |
| Inicio de sesión | Implementado en React y conectado a la API NestJS. La sesión del frontend se conserva en memoria. |
| Registro y renovación de sesión | Endpoints implementados en el backend. |
| Catálogo | Lista productos activos desde la API, permite búsqueda por texto y muestra una vista de detalle. |
| Productos | La API expone consulta de productos activos y filtro opcional por categoría. |
| Usuarios | La API incluye rutas protegidas para consultar y administrar usuarios según su rol. |
| Categorías | Existe el modelo y la tabla en la base de datos; todavía no hay un endpoint funcional para listarlas. |
| Carrito y pedidos | El esquema de base de datos incluye sus tablas; sus módulos funcionales quedan pendientes. |
| Administración de productos | No hay endpoints de creación o edición de productos en el alcance implementado. |

El backlog del equipo también contempla mejoras futuras como la gestión del catálogo, carrito y pedidos. Estas funciones no se describen aquí como terminadas.

## Tecnologías

| Componente | Tecnologías |
| --- | --- |
| Frontend | React 18, JavaScript, Vite y CSS |
| Backend | Node.js, NestJS, TypeScript y Express |
| Persistencia | MySQL, Sequelize y sequelize-typescript |
| Autenticación | JWT y bcrypt |
| Validación | class-validator, class-transformer y Zod para configuración |
| Documentación de API | Swagger |
| Pruebas | Node.js test runner en frontend; Jest y Supertest en backend |

## Arquitectura y estructura

El frontend organiza las pantallas y la comunicación con la API en componentes y servicios. El backend separa módulos, controladores, servicios, repositorios, entidades y DTOs. MySQL almacena los datos relacionales y el esquema inicial se define mediante una migración de Sequelize.

```text
EcomPacific/
├── frontend/
│   ├── src/                 # React, estilos, servicios y validación
│   └── test/                # Pruebas del inicio de sesión
├── backend/
│   ├── src/modules/         # Autenticación, usuarios y productos
│   ├── src/migrations/      # Migraciones de la base de datos
│   └── test/                # Pruebas unitarias y e2e
├── database/                # Carpeta reservada para recursos de base de datos
├── LICENSE
└── README.md
```

## Requisitos

- Node.js 18 o superior y npm 9 o superior.
- MySQL 8 o MariaDB 10, iniciado localmente o accesible por red.
- Git para obtener y actualizar el repositorio.

## Configurar la base de datos y el backend

Desde MySQL crea una base de datos vacía:

```sql
CREATE DATABASE ecompacific CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

En PowerShell, desde la raíz del repositorio:

```powershell
cd backend
npm install
Copy-Item .env.example .env
```

Edita `backend/.env` con tu configuración local. Las variables reconocidas se muestran en `backend/.env.example`:

```dotenv
NODE_ENV=development
PORT=3000
API_PREFIX=api
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_clave_local
DB_NAME=ecompacific
JWT_SECRET=reemplaza_por_un_secreto_local_de_al_menos_32_caracteres
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=reemplaza_por_otro_secreto_local_de_al_menos_32_caracteres
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_ROUNDS=10
CORS_ORIGIN=http://localhost:5173
SWAGGER_ENABLED=true
SWAGGER_PATH=docs
```

Usa valores propios en el archivo `.env`; no guardes secretos reales en Git. Ejecuta la migración inicial y arranca la API:

```powershell
npm run db:migrate
npm run start:dev
```

La API usa `http://localhost:3000/api` por defecto. Swagger se publica en `http://localhost:3000/docs` cuando `SWAGGER_ENABLED=true`.

## Configurar y ejecutar el frontend

En otra terminal, desde la raíz del repositorio:

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Vite muestra la dirección local al arrancar, normalmente `http://localhost:5173`. `VITE_API_URL` es la URL base del backend y por defecto apunta a `http://localhost:3000/api`. El catálogo se abre desde el enlace “Explorar el catálogo” del inicio de sesión; también puede abrirse en `/#productos`.

## Endpoints existentes

Las respuestas exitosas de la API están envueltas como `{ success, data, timestamp, path }`.

| Método | Ruta | Acceso y utilidad |
| --- | --- | --- |
| `POST` | `/api/auth/login` | Público; valida credenciales y entrega tokens y datos públicos del usuario. |
| `POST` | `/api/auth/register` | Público; registra un usuario con rol de cliente. |
| `POST` | `/api/auth/refresh` | Público; renueva los tokens usando un refresh token. |
| `GET` | `/api/auth/me` | Requiere token; devuelve el payload del usuario autenticado. |
| `GET` | `/api/products` | Público; lista productos activos e incluye sus datos de categoría. |
| `GET` | `/api/products?categoriaId=2` | Público; filtra productos activos por ID de categoría. |
| `GET` | `/api/products/:id` | Público; consulta un producto activo por ID. |
| `GET` | `/api/usuarios` y `/api/usuarios/:id` | Requiere token y rol `ADMIN` o `VENDEDOR`. |
| `POST`, `PUT`, `DELETE` | `/api/usuarios` y `/api/usuarios/:id` | Requiere token y rol `ADMIN`. |
| `GET` | `/api/usuarios/perfil/me` | Requiere token; consulta el perfil actual. |

El endpoint del catálogo devuelve `nombre`, `descripcion`, `precio`, `stock`, `imagenUrl`, `disponible`, `categoriaId` y `categoriaNombre`. La búsqueda se aplica en el navegador sobre los productos recibidos; no hay paginación implementada.

## Autenticación

El inicio de sesión envía correo y contraseña a `POST /api/auth/login`. El backend verifica el hash con bcrypt y entrega un access token, un refresh token y datos públicos. El frontend mantiene la sesión en memoria y no escribe los tokens en `localStorage`. Las rutas de usuarios aplican guards JWT y roles.

## Pruebas y comandos disponibles

Frontend, desde `frontend/`:

```bash
npm test
npm run build
```

Backend, desde `backend/`:

```bash
npm test -- --runInBand
npm run test:e2e -- --runInBand
npm run build
npm run lint
```

Las pruebas e2e pueden requerir una base de datos configurada. El comando `npm run lint` ejecuta ESLint con `--fix`, por lo que modifica archivos que encuentre con problemas.

## Trabajo con Scrum y colaboración

El backlog del equipo se organiza mediante épicas e historias de usuario con criterios de aceptación. Se propone trabajar en sprints de dos semanas, sujeto al acuerdo del equipo, con planificación, Daily Scrum, refinamiento, revisión y retrospectiva.

Épicas documentadas en el backlog:

- **EP-01:** consultar la oferta de la tienda.
- **EP-02:** administrar el catálogo de forma segura.
- **EP-03:** preparar una compra.
- **EP-04:** registrar y gestionar pedidos.

Integrantes documentados en el README compartido del proyecto:

| Integrante | Responsabilidad | Enfoque principal |
| --- | --- | --- |
| Brayan Rodallega | Scrum Master | Facilitación, seguimiento de impedimentos y coordinación de documentación |
| Mario Bustamante | Developer | Frontend |
| Jhon Suarez | Developer | Backend |
| Cristian Arias | Developer | Base de datos |

Flujo Git propuesto:

1. Acordar la historia y sus criterios para el sprint.
2. Crear una rama de trabajo desde `dev`, por ejemplo `feature/hu-01-catalogo`.
3. Implementar y validar la historia.
4. Abrir un pull request hacia `dev`, indicando la issue relacionada y las comprobaciones realizadas.
5. Solicitar revisión de otro integrante y atender sus observaciones.
6. Integrar y comprobar el comportamiento conjunto.
7. Incorporar versiones estables a `main` mediante pull request.

Una historia se considera terminada cuando cumple sus criterios y la Definición de Terminado, además de estar integrada.

## Enlaces del equipo

- [Repositorio en GitHub](https://github.com/brayanrodallega/EcomPacific)
- [Issues](https://github.com/brayanrodallega/EcomPacific/issues)
- [Pull requests](https://github.com/brayanrodallega/EcomPacific/pulls)
- [Proyectos](https://github.com/brayanrodallega/EcomPacific/projects)
