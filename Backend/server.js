const path = require('node:path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');

const usuarioRoutes = require('./routes/usuarioRoutes');
const servicioRoutes = require('./routes/servicioRoutes');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const seedInitialCatalog = require('./seedInitialCatalog');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || origin === CORS_ORIGIN) {
    if (origin) res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  }
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.json({ limit: '5mb' }));

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

async function seedInitialData() {
  const Usuario = require('./models/usuario');

  await seedInitialCatalog();

  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (ADMIN_NAME && ADMIN_EMAIL && ADMIN_PASSWORD) {
    const correo = ADMIN_EMAIL.trim().toLowerCase();
    if (!await Usuario.findOne({ correo })) {
      await new Usuario({
        nombre: ADMIN_NAME.trim(),
        correo,
        contraseña: ADMIN_PASSWORD,
        rol: 'admin'
      }).save();
      console.log(`Administrador inicial creado para ${correo}.`);
    }
  }
}

async function startServer() {
  if (!MONGO_URI) throw new Error('MONGO_URI no está configurado. Revisa Backend_yurley/.env.example.');
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET no está configurado. Define una clave segura en Backend_yurley/.env.');

  await mongoose.connect(MONGO_URI);
  await seedInitialData();
  app.listen(PORT, () => {
    console.log(`Servidor de GastroBar corriendo en http://localhost:${PORT}`);
  });
}

startServer().catch(error => {
  console.error('No se pudo iniciar GastroBar:', error.message);
  process.exitCode = 1;
});