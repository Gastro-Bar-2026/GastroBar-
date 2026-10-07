const express = require('express');
const router = express.Router();
const usuarioCtrl = require('../controllers/usuarioController');

// Autenticación
router.post('/register', usuarioCtrl.register);
router.post('/login', usuarioCtrl.login);

// CRUD
router.get('/', usuarioCtrl.obtenerUsuarios);
router.get('/:id', usuarioCtrl.obtenerUsuarioPorId);
router.put('/:id', usuarioCtrl.actualizarUsuario);
router.delete('/:id', usuarioCtrl.eliminarUsuario);

module.exports = router;