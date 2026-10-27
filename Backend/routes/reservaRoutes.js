const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');
const { verificarToken } = require('../middlewares/auth');

// POST /api/reservas -> Crear reserva (HUS-06)
router.post('/', verificarToken, reservaController.crearReserva);

module.exports = router;