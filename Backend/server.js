const path = require('node:path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');

const usuarioRoutes = require('./routes/usuarioRoutes');
const servicioRoutes = require('./routes/servicioRoutes');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const reservaRoutes = require('./routes/reservaRoutes');


const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API de GastroBar en funcionamiento');
});

app.get('/health', (req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({
    status: connected ? 'ok' : 'degraded',
    database: connected ? 'connected' : 'disconnected'
  });
});

app.use('/api', (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ mensaje: 'La base de datos no está disponible' });
  }
  next();
});

// Enlazar rutas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/servicios', servicioRoutes);
app.use('/api/Dashboard', dashboardRoutes);
app.use('/api/reservas', reservaRoutes);

app.listen(PORT, () => {
  console.log(`Servidor de GastroBar corriendo en http://localhost:${PORT}`);
});

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET no está configurado. Copia .env.example a .env y define una clave segura.');
}

if (!MONGO_URI) {
  console.error('MONGO_URI no está configurado. Copia .env.example a .env y configura tu conexión a MongoDB.');
} else {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('Conectado a MongoDB - GastroBar'))
    .catch(err => console.error('Error al conectar a MongoDB:', err.message));
}