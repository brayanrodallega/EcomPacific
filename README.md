# EcomPacific

EcomPacific es una plataforma de comercio electrónico para que una tienda publique sus productos y gestione existencias y pedidos desde un solo lugar. El alcance inicial incluye catálogo público, carrito y pedidos como invitado con pago al recoger en tienda. El administrador podrá actualizar el catálogo y dar seguimiento a los pedidos desde un panel con acceso restringido.

La estructura inicial del repositorio separa el frontend, el backend y el diseño de datos. La guía de ejecución describe la configuración prevista para cuando ambos servicios estén disponibles en la rama de trabajo.

## Tecnologías y arquitectura

| Componente | Tecnologías | Responsabilidad |
|---|---|---|
| Frontend | React, TypeScript y Vite | Presentar el catálogo, el carrito y el panel administrativo; consumir la API REST. |
| Backend | Node.js, NestJS, TypeScript y Sequelize | Validar solicitudes, autenticar al administrador con JWT, aplicar reglas de negocio y acceder a los datos. |
| Base de datos | MySQL 8; MySQL Workbench opcional | Almacenar categorías, productos, cuentas administrativas, pedidos y sus detalles. |

El navegador se comunica con el backend mediante HTTP. La API se organiza en módulos y separa la recepción de solicitudes, las reglas de negocio y el acceso a datos. El frontend no se conecta directamente a MySQL.

## Estructura del repositorio

| Ruta | Contenido |
|---|---|
| `database/` | Diagrama entidad–relación, modelo relacional y script SQL inicial. Consulta el estado y los enlaces en la Wiki. |
| `backend/` | Espacio para la API y sus módulos de negocio. |
| `frontend/` | Espacio para la aplicación web y los servicios que consumen la API. |

### Frontend: arquitectura por capas

La **capa de presentación** muestra las pantallas y sus componentes. La **capa de aplicación** coordina el estado y los flujos de uso. La **capa de infraestructura** realiza las peticiones HTTP a la API. Los tipos de dominio describen los datos del producto sin depender de React ni de HTTP.

Estructura prevista:

```text
frontend/
├── public/                        # Archivos públicos
├── src/
│   ├── presentation/
│   │   ├── pages/                 # Catálogo, detalle y administración
│   │   ├── components/            # Componentes reutilizables
│   │   └── styles/                # Estilos de la interfaz
│   ├── application/
│   │   ├── hooks/                 # Carga de datos y lógica de interacción
│   │   └── state/                 # Estado del carrito y de la sesión
│   ├── domain/
│   │   └── types/                 # Tipos de producto, carrito y pedido
│   ├── infrastructure/
│   │   └── api/                   # Cliente HTTP y servicios de la API
│   ├── App.tsx
│   └── main.tsx
├── .env.example
├── package.json
└── vite.config.ts
```

### Backend: arquitectura modular

NestJS agrupa el código por funcionalidad. Dentro de cada módulo, los **controladores** reciben las solicitudes, los **servicios** aplican las reglas de negocio y los **repositorios** consultan o actualizan MySQL mediante Sequelize.

Estructura de referencia para el desarrollo:

```text
backend/
├── src/
│   ├── config/                    # Configuración de la API y de MySQL
│   ├── core/                      # Filtros, validación e interceptores
│   ├── middlewares/               # Procesamiento transversal de solicitudes
│   ├── modules/
│   │   ├── productos/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── entities/
│   │   │   ├── dto/
│   │   │   └── productos.module.ts
│   │   ├── autenticacion/         # Acceso administrativo, JWT y permisos
│   │   ├── categorias/            # Categorías de productos
│   │   └── compartido/            # Conexión y configuración de Sequelize
│   ├── migrations/                # Evolución del esquema
│   ├── app.module.ts
│   └── main.ts
├── test/
├── .env.example
├── package.json
└── tsconfig.json
```

### Base de datos

En `database/` se encuentran los tres entregables del diseño inicial:

- [Diagrama entidad–relación](database/ModeloER.jpeg): entidades, relaciones y cardinalidades.
- [Modelo relacional](database/modelorelacional.jpeg): tablas y relaciones mediante claves.
- [Script SQL inicial](database/eccomercePacific.sql): definición inicial del esquema en MySQL.

## Configuración local prevista

Se requiere Git, Node.js y npm para las aplicaciones, y una instancia local de MySQL 8. Confirma la versión de Node.js compatible con los manifiestos del frontend y el backend cuando estén disponibles.

| Componente | Variables principales | Uso o valor local de ejemplo |
|---|---|---|
| Backend | `PORT`, `API_PREFIX` | `3000` y `api`. |
| Backend | `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | Conexión a MySQL. Ejemplo: `localhost:3306`, base `ecompacific` y un usuario local autorizado. |
| Backend | `JWT_SECRET`, `JWT_REFRESH_SECRET` | Secretos distintos para los tokens de acceso y renovación. |
| Backend | `CORS_ORIGIN` | Origen permitido si el navegador consulta directamente la API; por ejemplo, `http://localhost:5173` si ese es el puerto del frontend. |
| Frontend | `VITE_API_PROXY_TARGET` | Destino del proxy local de Vite, por ejemplo `http://localhost:3000`. |
| Frontend | `VITE_API_URL` | URL base de la API cuando no se usa el proxy; debe incluir el prefijo, por ejemplo `http://localhost:3000/api`. |

Cuando exista un `.env.example` en cada servicio, úsalo como referencia para crear su `.env` local. Guarda las credenciales y secretos solo en el backend; las variables `VITE_*` son visibles en el cliente. No subas archivos `.env` con valores reales.

## Ejecución local prevista

Los comandos de npm aplican cuando la rama incluya los archivos `package.json` y los scripts correspondientes. La estructura inicial por sí sola no permite arrancar la aplicación.

1. **Base de datos:** inicia MySQL. Aplica el [script SQL inicial](database/eccomercePacific.sql) sobre una instancia de desarrollo siguiendo el orden indicado en la Wiki. Si la versión de trabajo usa migraciones para inicializar el esquema, sigue ese flujo para evitar crear las mismas tablas dos veces.
2. **Backend:** configura su entorno y ejecuta desde la raíz del repositorio:

   ```bash
   cd backend
   npm install
   npm run start:dev
   ```

3. **Frontend:** en otra terminal, desde la raíz del repositorio, configura el acceso a la API y ejecuta:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Verificación:** abre la URL que muestre Vite y comprueba que el catálogo puede consultar la API. Si el catálogo no tiene productos, comprueba que la interfaz muestra el estado vacío.

## Documentación y seguimiento

- [Wiki de EcomPacific](https://github.com/brayanrodallega/EcomPacific/wiki): visión, requerimientos, arquitectura, modelo de datos y cronograma de liberación.
- [GitHub Issues](https://github.com/brayanrodallega/EcomPacific/issues): historias de usuario, criterios de aceptación y tareas.
- [GitHub Projects](https://github.com/brayanrodallega/EcomPacific/projects): seguimiento del Product Backlog y los sprints.
- [Pull requests](https://github.com/brayanrodallega/EcomPacific/pulls): revisión e integración de cambios.

Consulta [LICENSE](LICENSE) para conocer las condiciones de uso del repositorio.
