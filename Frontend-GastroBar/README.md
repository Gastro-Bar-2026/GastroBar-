# GastroBar Frontend

## Conectar con el backend

El frontend usa la API de GastroBar. En desarrollo, Vite reenvía `/api` y
`/health` a `http://localhost:3000`. Si el backend está en otra dirección,
define `GASTROBAR_API_URL` antes de iniciar Vite o configura `VITE_API_URL`
para una API accesible desde el navegador.

## Inicio local

1. Configura MongoDB y las variables de entorno en
   `../Backend_yurley/.env` siguiendo las instrucciones del README del backend.
2. En una terminal, inicia la API desde `../Backend_yurley` con `npm install`
   y `npm start`.
3. En otra terminal, inicia el frontend desde esta carpeta con `npm install`
   y `npm run dev`.
4. Abre la URL que muestra Vite (normalmente `http://localhost:5173`).

El catálogo inicial se inserta en MongoDB la primera vez que se inicia la API.
El registro crea cuentas de cliente; la cuenta administradora se configura
mediante `ADMIN_NAME`, `ADMIN_EMAIL` y `ADMIN_PASSWORD` en el `.env` del backend.
En la página de inicio, la sección de eventos permite ir directamente al
formulario de reservas. Un administrador puede iniciar sesión desde el menú:
al autenticarse, la aplicación abre automáticamente el panel de administración.
