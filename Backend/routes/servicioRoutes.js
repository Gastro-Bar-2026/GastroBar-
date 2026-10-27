const express = require('express');
const router = express.Router();
const servicioCtrl = require('../controllers/servicioController');
const { verificarToken, autorizarRol } = require('../middlewares/auth');

// Consulta del catálogo (pública: la necesita el flujo de reservas, HUS-06)
router.get('/', servicioCtrl.obtenerServicios);
router.get('/:id', servicioCtrl.obtenerServicioPorId);

// Gestión de servicios (HUS-05: solo administrador)
router.post('/', verificarToken, autorizarRol('admin'), servicioCtrl.crearServicio);
router.put('/:id', verificarToken, autorizarRol('admin'), servicioCtrl.actualizarServicio);
router.delete('/:id', verificarToken, autorizarRol('admin'), servicioCtrl.eliminarServicio);

module.exports = router;