# EcomPacific API

API NestJS y TypeScript para autenticación, usuarios y consulta del catálogo. Sequelize conecta con MySQL; Swagger documenta las rutas.

## Arquitectura

- `modules/autenticacion`: login, registro, renovación de tokens y consulta del usuario autenticado.
- `modules/usuarios`: servicios, repositorio Sequelize, entidad y rutas protegidas por JWT y roles.
- `modules/productos`: entidad, repositorio, servicio y rutas de consulta pública del catálogo.
- `modules/categorias/entities`: entidad relacionada con los productos. La API de categorías aún no está implementada.
- `modules/compartido`: conexión con la base de datos.
- `core`: guards, validación, transformación de respuestas y decoradores.
- `migrations`: esquema inicial versionado de MySQL.

## Requisitos y configuración

- Node.js 18 o superior y npm 9 o superior.
- MySQL 8 o MariaDB 10.

Crea la base `ecompacific`, instala dependencias y copia el ejemplo de entorno:

```bash
npm install
```

Copia `.env.example` como `.env`, configura conexión MySQL y reemplaza los dos secretos JWT de muestra por secretos propios de al menos 32 caracteres. No guardes `.env` en Git.

```bash
npm run db:migrate
npm run start:dev
```

La API usa `http://localhost:3000/api`; Swagger está en `http://localhost:3000/docs` cuando está habilitado. Configura `CORS_ORIGIN` para el origen del frontend.

## Rutas principales

| Método | Ruta | Uso |
| --- | --- | --- |
| `POST` | `/api/auth/login` | Validar credenciales y emitir tokens. |
| `POST` | `/api/auth/register` | Registrar un usuario cliente. |
| `POST` | `/api/auth/refresh` | Renovar tokens. |
| `GET` | `/api/auth/me` | Consultar el payload del token actual; requiere JWT. |
| `GET` | `/api/products` | Listar productos activos y datos de categoría. |
| `GET` | `/api/products?categoriaId=2` | Filtrar productos activos por categoría. |
| `GET` | `/api/products/:id` | Obtener un producto activo por ID. |
| `GET` | `/api/usuarios`, `/api/usuarios/:id` | Consultar usuarios con rol `ADMIN` o `VENDEDOR`. |
| `POST`, `PUT`, `DELETE` | `/api/usuarios` y `/api/usuarios/:id` | Administración de usuarios para rol `ADMIN`. |
| `GET` | `/api/usuarios/perfil/me` | Consultar perfil con JWT. |

Las respuestas exitosas se envuelven en `{ success, data, timestamp, path }`. El catálogo solo expone campos de producto para uso público y no devuelve registros inactivos. El filtro `categoriaId` debe ser un entero positivo.

## Autenticación y datos

El backend verifica contraseñas con bcrypt. Los tokens son JWT y las rutas administrativas aplican guards de autenticación y roles. La migración inicial crea usuarios, categorías, productos, carritos, elementos de carrito, órdenes y elementos de orden. Los endpoints funcionales de carrito y pedidos aún están pendientes.

## Comprobaciones

```bash
npm run build
npm test -- --runInBand
npm run test:e2e -- --runInBand
npm run lint
```

Las pruebas e2e requieren la configuración y una base de datos de prueba accesibles. `npm run lint` ejecuta ESLint con `--fix` y puede modificar los archivos que revise.
