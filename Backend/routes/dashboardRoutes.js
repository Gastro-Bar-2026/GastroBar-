const express = require('express');
const dashboardCtrl = require('../controllers/dashboardController');
const { verificarToken, autorizarRol } = require('../middlewares/auth');

const router = express.Router();

router.get('/stats', verificarToken, autorizarRol('admin'), dashboardCtrl.obtenerEstadisticas);

module.exports = router;
