# EcomPacific

Aplicación web para la gestión de una tienda online, desarrollada como proyecto académico de la asignatura.

El proyecto integra la construcción de un producto de software con la aplicación de **Scrum**, mediante planificación por sprints, colaboración, entregas incrementales y mejora continua.

## Objetivo del producto

Permitir que una tienda publique y administre sus productos y que sus compradores consulten el catálogo, preparen una compra y registren pedidos, manteniendo información consistente de precios, existencias y estados.

## Alcance funcional previsto

| Área | Funcionalidades |
|---|---|
| Catálogo | Consultar productos, ver sus detalles y reconocer su disponibilidad |
| Administración | Iniciar y cerrar sesión, crear y editar productos, cambiar su estado y ajustar existencias |
| Carrito | Agregar productos, modificar cantidades, eliminar elementos y consultar totales |
| Pedidos | Registrar pedidos, consultar sus detalles y gestionar sus estados desde el panel administrativo |
| Búsqueda | Buscar productos por nombre y filtrar por categoría como mejora posterior |


## Equipo

| Integrante | Responsabilidad | Enfoque principal |
|---|---|---|
| Brayan Rodallega | Scrum Master | Facilitación, seguimiento de impedimentos y coordinación de documentación |
| Mario Bustamante | Developer | Frontend |
| Jhon Suarez | Developer | Backend |
| Cristian Arias | Developer | Base de datos |

Las especialidades orientan la colaboración. Los integrantes participan conjuntamente en la integración, revisión y validación de las funcionalidades.

## Tecnologías

| Componente | Tecnologías previstas |
|---|---|
| Frontend | React y JavaScript |
| Backend | NestJs, Node.js, Express y TypeScript |
| Autenticación | JWT |
| Base de datos | MySQL |
| Modelado y administración de datos | MySQL Workbench |
| Control de versiones y colaboración | Git y GitHub |
| Gestión del trabajo | GitHub Issues y GitHub Projects |

## Arquitectura

Se utilizará una arquitectura por capas y modular para organizar responsabilidades y facilitar el mantenimiento.

| Componente | Organización prevista |
|---|---|
| Frontend | Presentación, lógica de interfaz y servicios de comunicación con la API |
| Backend | Modulos, rutas y controladores, servicios de negocio y acceso a datos |
| Base de datos | Esquema relacional, restricciones y scripts versionados |

La interfaz consumirá la API del backend. El backend aplicará las reglas de negocio y accederá a MySQL. Las operaciones administrativas requerirán autenticación y autorización.

## Organización del repositorio

| Ruta | Contenido |
|---|---|
| `frontend/` | Aplicación cliente |
| `backend/` | API y lógica de negocio |
| `database/` | Modelo y scripts de base de datos |
| `README.md` | Presentación y orientación general del proyecto |
| `LICENSE` | Condiciones de uso del repositorio |

## Gestión del producto

El Product Backlog se organiza mediante épicas e historias de usuario registradas en GitHub. Cada historia describe una necesidad y sus criterios de aceptación.

| Épica | Resultado esperado |
|---|---|
| EP-01 — Consultar la oferta de la tienda | Los visitantes conocen los productos, precios y disponibilidad |
| EP-02 — Administrar el catálogo de forma segura | El administrador mantiene productos y existencias |
| EP-03 — Preparar una compra | El comprador organiza y revisa su selección |
| EP-04 — Registrar y gestionar pedidos | La tienda recibe pedidos y registra su atención |

Las prioridades y el alcance se revisarán conforme se obtenga información. Durante la planificación de cada sprint, los Developers seleccionarán el trabajo según el objetivo y su capacidad disponible.

### Espacios de trabajo

- [Repositorio](https://github.com/brayanrodallega/EcomPacific)
- [Issues](https://github.com/brayanrodallega/EcomPacific/issues)
- [Pull requests](https://github.com/brayanrodallega/EcomPacific/pulls)
- [Proyectos vinculados al repositorio](https://github.com/brayanrodallega/EcomPacific/projects)

## Forma de trabajo con Scrum

Se propone una duración de **dos semanas por sprint**, pendiente de acuerdo del equipo. Cada sprint buscará entregar una funcionalidad integrada que pueda demostrarse.

| Actividad | Propósito |
|---|---|
| Sprint Planning | Acordar el objetivo del sprint, seleccionar historias y preparar el plan de trabajo |
| Daily Scrum | Revisar el avance hacia el objetivo y ajustar el próximo trabajo |
| Refinamiento del backlog | Aclarar necesidades, criterios, dependencias y tamaño de las historias próximas |
| Sprint Review | Inspeccionar el incremento con los interesados y recoger retroalimentación |
| Sprint Retrospective | Revisar la colaboración y acordar mejoras para el siguiente sprint |

## Flujo de colaboración propuesto

- `main`: versiones estables y demostrables.
- `dev`: integración del trabajo del equipo.
- Ramas de trabajo: cambios asociados a una funcionalidad o corrección.

1. Seleccionar y comprender la historia acordada para el sprint.
2. Crear una rama desde `dev`, por ejemplo, `feature/hu-01-catalogo`.
3. Implementar y verificar el cambio.
4. Abrir un pull request hacia `dev`, indicando la issue relacionada y cómo se validó.
5. Solicitar revisión a otro integrante y atender sus observaciones.
6. Integrar y comprobar el comportamiento conjunto.
7. Incorporar a `main` las versiones estables mediante pull request.

La finalización de una historia depende de sus criterios y de la Definición de Terminado, además de la integración del código.
