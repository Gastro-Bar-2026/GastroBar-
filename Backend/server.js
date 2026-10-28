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
  const Servicio = require('./models/servicio');
  const Usuario = require('./models/usuario');

  if (await Servicio.countDocuments() === 0) {
    await Servicio.insertMany([
      { nombre: "JACK DANIEL'S", descripcion: 'Whisky Tennessee con notas de vainilla, caramelo y roble.', precio: 28000, categoria: 'Bebidas', ingredientes: ['Whisky', 'Vainilla', 'Caramelo'], disponible: true },
      { nombre: 'JOHNNIE WALKER', descripcion: 'Whisky escocés con frutas maduras, vainilla y un final ahumado.', precio: 24000, categoria: 'Bebidas', ingredientes: ['Whisky', 'Frutos del bosque', 'Vainilla'], disponible: true },
      { nombre: 'NEGRONI NEBULA', descripcion: 'Cóctel de ginebra, Campari y notas cítricas.', precio: 18000, categoria: 'Coctelería', ingredientes: ['Campari', 'Ginebra', 'Naranja'], disponible: true },
      { nombre: 'ENTRECOT AL SARMIENTO', descripcion: 'Corte madurado a la parrilla con guarnición de temporada.', precio: 52000, categoria: 'Comida', ingredientes: ['Entrecot', 'Hierbas', 'Vegetales'], disponible: true },
      { nombre: 'HAMBURGUESA BLACK ANGUS', descripcion: 'Hamburguesa de res Black Angus, queso, vegetales y salsa de la casa.', precio: 36000, categoria: 'Comida', ingredientes: ['Black Angus', 'Queso', 'Vegetales'], disponible: true },
      { nombre: 'TABLA 100% BELLOTA', descripcion: 'Selección para compartir con productos curados y acompañamientos.', precio: 42000, categoria: 'Comida', ingredientes: ['Jamón curado', 'Quesos', 'Pan artesanal'], disponible: true },
      { nombre: 'Reserva de Mesa', descripcion: 'Solicitud de reserva de mesa en GastroBar.', precio: 0, categoria: 'Reserva de Mesa', disponible: true }
    ]);
    console.log('Catálogo inicial de GastroBar creado.');
  }

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