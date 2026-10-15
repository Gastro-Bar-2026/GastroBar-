# GastroBar Backend

## Requisitos

- Node.js
- Una instancia de MongoDB (Atlas o local)

## Configuracion e inicio

1. En esta carpeta, copia `.env.example` como `.env`.
2. En `.env`, define `MONGO_URI` con la URI privada de tu instancia de MongoDB.
3. Define también `JWT_SECRET` con una clave larga y segura (puedes generarla con
   `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`).
4. Opcional: ajusta `JWT_EXPIRES_IN` (por defecto `1d`) para cambiar la duración del token.
5. Instala las dependencias con `npm install`.
6. Inicia la API con `npm start`.

## Autenticación (JWT)

- `POST /api/usuarios/register` — registra un cliente y devuelve un `token`.
- `POST /api/usuarios/login` — valida credenciales y devuelve un `token`.

Las rutas protegidas esperan el header `Authorization: Bearer <token>`.

La API escucha en `http://localhost:3000` por defecto. La ruta `/health` informa
si MongoDB está conectado; las rutas `/api` responden `503` hasta que la base de
datos esté disponible.