const express = require('express');
const router = express.Router();
const servicioCtrl = require('../controllers/servicioController');

router.post('/', servicioCtrl.crearServicio);
router.get('/', servicioCtrl.obtenerServicios);
router.get('/:id', servicioCtrl.obtenerServicioPorId);
router.put('/:id', servicioCtrl.actualizarServicio);
router.delete('/:id', servicioCtrl.eliminarServicio);

module.exports = router;