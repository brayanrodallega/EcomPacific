# EcomPacific frontend

Interfaz del proyecto hecha con React y Vite.

## Ejecutar en desarrollo

```bash
npm install
```

Crea un archivo `.env` a partir de `.env.example` si el backend no está en `http://localhost:3000/api` y configura `VITE_API_URL` con la URL base de la API.

```bash
npm run dev
```

El formulario envía las credenciales a `POST /auth/login`. Para iniciar sesión correctamente, el backend debe estar en ejecución y tener usuarios registrados. Las credenciales inválidas muestran un mensaje genérico y la sesión se conserva solo en memoria del navegador.

## Compilar

```bash
npm run build
```
