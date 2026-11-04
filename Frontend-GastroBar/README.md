# GastroBar — Frontend

Aplicación web de GastroBar desarrollada con Vue.js y Vite. Permite consultar
el menú, conocer los eventos, realizar reservas y acceder a las herramientas de
administración según el rol del usuario.

## Requisitos

- Node.js y npm.
- MongoDB para ejecutar el backend.

## Inicio local

1. Configura MongoDB y las variables de entorno del backend siguiendo las
   instrucciones de `../Backend/README.md`.
2. Desde `../Backend`, instala las dependencias con `npm install` e inicia la
   API con `npm start`.
3. Desde esta carpeta, instala las dependencias con `npm install` e inicia el
   frontend con `npm run dev`.
4. Abre en el navegador la dirección que indique Vite, normalmente
   `http://localhost:5173`.

En desarrollo, Vite reenvía `/api` y `/health` al backend local. Configura
`GASTROBAR_API_URL` si el backend se ejecuta en otra dirección. También se puede
definir `VITE_API_URL` para conectar directamente con una API accesible desde
el navegador.

## Funcionalidades

- Inicio, menú y detalles de productos.
- Registro e inicio de sesión.
- Reserva de mesa.
- Sección de eventos y contacto.
- Panel de administración para usuarios autorizados.

El catálogo inicial se inserta en MongoDB al iniciar la API. El registro crea
cuentas de cliente; las credenciales de administración se configuran mediante
`ADMIN_NAME`, `ADMIN_EMAIL` y `ADMIN_PASSWORD` en el `.env` del backend. No
almacenes secretos en variables `VITE_`, ya que quedan disponibles en el
código del navegador.

## Compilación

```bash
npm run build
```

Vite genera los archivos de producción en `dist`. Para previsualizarlos
localmente:

```bash
npm run preview
```

## Despliegue en Render

El frontend puede publicarse como un servicio **Static Site**:

| Campo | Valor |
|---|---|
| Rama | `actualizacion-completa-backend-frontend` |
| Root Directory | `Frontend-GastroBar` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

Configura `VITE_API_URL` con la URL pública del backend y permite el dominio del
frontend en la configuración CORS del backend.
