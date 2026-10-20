# EcomPacific API

Backend para autenticación y gestión de usuarios. Está construido con NestJS y TypeScript; usa Sequelize para acceder a MySQL, bcrypt para verificar contraseñas y JWT para las sesiones.

## Arquitectura

- `modules/autenticacion`: controladores, DTOs y servicio para login, registro y renovación de tokens.
- `modules/usuarios`: servicio de negocio, repositorio Sequelize y entidad de usuario.
- `modules/compartido`: conexión a la base de datos.
- `core`: guards, validación e interceptor de respuestas.

Flujo de Login: `POST /api/auth/login` → `AutenticacionController` → `AutenticacionService` → `UsuariosService`/`UsuarioRepository` → MySQL. El servidor compara el hash bcrypt y solo entonces devuelve access token, refresh token y datos públicos del usuario. Los errores 401 usan el mismo mensaje para correo inexistente y contraseña incorrecta.

## Requisitos y ejecución

- Node.js 18 o superior
- npm 9 o superior
- MySQL 8 o MariaDB 10

Desde esta carpeta:

```bash
npm install
```

Copia `.env.example` como `.env` y configura la conexión MySQL y dos secretos JWT propios de al menos 32 caracteres. El ejemplo contiene valores de muestra; reemplázalos antes de iniciar el servidor.

```bash
npm run db:migrate
npm run start:dev
```

La API queda en `http://localhost:3000/api` y Swagger en `http://localhost:3000/docs`. El frontend local usa `http://localhost:5173`; configura `CORS_ORIGIN` con el origen del frontend que estés ejecutando.

## Rutas de autenticación

| Método | Ruta | Uso |
| --- | --- | --- |
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/auth/register` | Registrar usuario con rol `CLIENTE` |
| POST | `/api/auth/refresh` | Renovar tokens |
| GET | `/api/auth/me` | Consultar el payload del token actual |

Las respuestas correctas se envuelven en `{ success, data, timestamp, path }`. Las contraseñas se guardan como hash y no se incluyen en las respuestas serializadas de usuario. El frontend mantiene los tokens solo en memoria.

## Comprobaciones

```bash
npm run build
npm test -- --runInBand
npm run test:e2e -- --runInBand
```

Las pruebas unitarias de autenticación usan dobles para el repositorio y JWT. Las pruebas e2e requieren que la configuración y la base de datos de prueba estén disponibles.
