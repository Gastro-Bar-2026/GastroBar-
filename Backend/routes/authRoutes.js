const express = require('express');
const router = express.Router();
const usuarioCtrl = require('../controllers/usuarioController');

// HUS-02: registro e inicio de sesión de usuarios
router.post('/register', usuarioCtrl.register);
router.post('/login', usuarioCtrl.login);

module.exports = router;
