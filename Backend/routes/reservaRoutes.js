const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');
const { verificarToken } = require('../middlewares/auth');

// POST /api/reservas -> Crear reserva (HUS-06)
router.post('/', verificarToken, reservaController.crearReserva);

// GET /api/reservas -> Consultar reservas (HUS-07)
router.get('/', verificarToken, reservaController.obtenerReservas);

module.exports = router;