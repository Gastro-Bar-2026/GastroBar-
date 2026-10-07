# GastroBar Backend

## Requisitos

- Node.js
- Una instancia de MongoDB (Atlas o local)

## Configuracion e inicio

1. En esta carpeta, copia `.env.example` como `.env`.
2. En `.env`, define `MONGO_URI` con la URI privada de tu instancia de MongoDB.
3. Instala las dependencias con `npm install`.
4. Inicia la API con `npm start`.

La API escucha en `http://localhost:3000` por defecto. La ruta `/health` informa
si MongoDB está conectado; las rutas `/api` responden `503` hasta que la base de
datos esté disponible.