const express = require('express');
const router = express.Router();
const usuarioCtrl = require('../controllers/usuarioController');
const { verificarToken, autorizarRol } = require('../middlewares/auth');

// Autenticación (públicas)
router.post('/register', usuarioCtrl.register);
router.post('/login', usuarioCtrl.login);

// CRUD (protegidas: solo admin)
router.get('/', verificarToken, autorizarRol('admin'), usuarioCtrl.obtenerUsuarios);
router.get('/:id', verificarToken, usuarioCtrl.obtenerUsuarioPorId);
router.put('/:id', verificarToken, usuarioCtrl.actualizarUsuario);
router.delete('/:id', verificarToken, autorizarRol('admin'), usuarioCtrl.eliminarUsuario);

module.exports = router;