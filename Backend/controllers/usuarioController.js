const Usuario = require('../models/usuario');

// Registro
exports.register = async (req, res) => {
  try {
    const { nombre, correo, contraseña, telefono } = req.body;
    if (!nombre || !correo || !contraseña) {
      return res.status(400).json({ mensaje: 'Faltan datos obligatorios: nombre, correo o contraseña' });
    }
    const existe = await Usuario.findOne({ correo });
    if (existe) {
      return res.status(400).json({ mensaje: 'Ese correo ya está registrado' });
    }
    const nuevoUsuario = new Usuario({ nombre, correo, contraseña, telefono, rol: 'cliente' });
    await nuevoUsuario.save();
    res.status(201).json({ mensaje: 'Cliente registrado con éxito', usuario: nuevoUsuario });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error del servidor', error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;
    const usuario = await Usuario.findOne({ correo, contraseña });
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
    }
    res.json({ mensaje: `Bienvenido, ${usuario.nombre}`, usuario });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error del servidor', error: error.message });
  }
};

// Obtener todos
exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-contraseña');
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuarios', error: error.message });
  }
};

// Obtener uno
exports.obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select('-contraseña');
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al consultar usuario', error: error.message });
  }
};

// Actualizar
exports.actualizarUsuario = async (req, res) => {
  try {
    const { contraseña, ...datos } = req.body;
    const actualizado = await Usuario.findByIdAndUpdate(req.params.id, datos, { new: true }).select('-contraseña');
    if (!actualizado) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar usuario', error: error.message });
  }
};

// Eliminar
exports.eliminarUsuario = async (req, res) => {
  try {
    const eliminado = await Usuario.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json({ mensaje: 'Usuario eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar usuario', error: error.message });
  }
};