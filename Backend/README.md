# GastroBar Backend

## Requisitos

- Node.js
- Una instancia de MongoDB local o Atlas

## Configuración e inicio

1. Copia `.env.example` a `.env`.
2. Define `MONGO_URI` con la conexión a tu base de datos.
3. Genera un secreto JWT seguro y asígnalo a `JWT_SECRET`:
   `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
4. Define `ADMIN_NAME`, `ADMIN_EMAIL` y `ADMIN_PASSWORD` para crear el primer
   administrador. Usa una contraseña segura; el backend no crea administradores
   con credenciales predeterminadas. Si la cuenta ya existe, no se modifica.
5. Instala e inicia el backend: `npm install` y `npm start`.

El servidor escucha en `http://localhost:3000`. En el primer inicio inserta un
catálogo inicial si todavía no hay servicios. Las rutas `/api` requieren una
conexión activa con MongoDB. La ruta `/health` informa el estado de la API y la
base de datos.

## API principal

- `POST /api/auth/register` y `POST /api/auth/login` — registro de clientes e
  inicio de sesión; ambas respuestas incluyen un token JWT.
- `GET /api/servicios` — catálogo público.
- `POST /api/reservas` — crea una reserva para el usuario autenticado.
- `GET /api/reservas` — el cliente consulta sus reservas y el administrador
  consulta todas.
- `PUT /api/reservas/:id` — permite actualizar una reserva propia; solo un
  administrador puede cambiar su estado.
- `POST`, `PUT` y `DELETE /api/servicios` — gestión de catálogo para
  administradores.
- `GET /api/usuarios` y `GET /api/Dashboard/stats` — información administrativa.

Las rutas protegidas requieren `Authorization: Bearer <token>`. Para desarrollo,
el frontend Vite usa un proxy hacia este servidor. En despliegues con orígenes
distintos, configura `CORS_ORIGIN` con el origen exacto del frontend.
