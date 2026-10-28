const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

// Genera un token JWT firmado con el id y el rol del usuario
const firmarToken = (usuario) => {
  return jwt.sign(
    { id: usuario._id, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
};

// Registro
exports.register = async (req, res) => {
  try {
    const { nombre, contraseña, telefono } = req.body;
    const correo = String(req.body.correo || '').trim().toLowerCase();
    if (!nombre || !correo || !contraseña) {
      return res.status(400).json({ mensaje: 'Faltan datos obligatorios: nombre, correo o contraseña' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      return res.status(400).json({ mensaje: 'El correo no tiene un formato válido' });
    }
    if (String(contraseña).length < 6) {
      return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 6 caracteres' });
    }
    const existe = await Usuario.findOne({ correo });
    if (existe) {
      return res.status(400).json({ mensaje: 'Ese correo ya está registrado' });
    }
    const nuevoUsuario = new Usuario({ nombre, correo, contraseña, telefono, rol: 'cliente' });
    await nuevoUsuario.save(); // el hash se aplica en el pre('save') del modelo
    const token = firmarToken(nuevoUsuario);
    res.status(201).json({
      mensaje: 'Cliente registrado con éxito',
      token,
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo,
        rol: nuevoUsuario.rol
      }
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error del servidor', error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const correo = String(req.body.correo || '').trim().toLowerCase();
    const { contraseña } = req.body;
    if (!correo || !contraseña) {
      return res.status(400).json({ mensaje: 'Correo y contraseña son obligatorios' });
    }
    const usuario = await Usuario.findOne({ correo });
    if (!usuario || !(await usuario.compararContraseña(contraseña))) {
      return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
    }
    const token = firmarToken(usuario);
    res.json({
      mensaje: `Bienvenido, ${usuario.nombre}`,
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
      }
    });
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

// Obtener uno (admin o el propio usuario)
exports.obtenerUsuarioPorId = async (req, res) => {
  try {
    const esAdmin = req.usuario.rol === 'admin';
    const esPropioPerfil = String(req.usuario.id) === String(req.params.id);
    if (!esAdmin && !esPropioPerfil) {
      return res.status(403).json({ mensaje: 'Solo puedes consultar tu propio perfil' });
    }

    const usuario = await Usuario.findById(req.params.id).select('-contraseña');
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al consultar usuario', error: error.message });
  }
};

// Actualizar
// - admin: puede modificar cualquier usuario, incluido el rol
// - cliente: solo su propio perfil y sin poder cambiar el rol ni el correo de otro
const ROLES_VALIDOS = ['admin', 'cliente'];

exports.actualizarUsuario = async (req, res) => {
  try {
    const esAdmin = req.usuario.rol === 'admin';
    const esPropioPerfil = String(req.usuario.id) === String(req.params.id);

    if (!esAdmin && !esPropioPerfil) {
      return res.status(403).json({ mensaje: 'Solo puedes modificar tu propio perfil' });
    }

    const { contraseña, rol, ...datos } = req.body;

    // Solo un admin puede cambiar el rol, y debe ser un valor permitido
    if (rol !== undefined) {
      if (!esAdmin) {
        return res.status(403).json({ mensaje: 'Solo un administrador puede cambiar el rol' });
      }
      if (!ROLES_VALIDOS.includes(rol)) {
        return res.status(400).json({ mensaje: 'Rol no válido' });
      }
      datos.rol = rol;
    }

    // La contraseña se hashea aparte para que pase por el pre('save') del modelo
    if (contraseña) {
      if (String(contraseña).length < 6) {
        return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 6 caracteres' });
      }
      const usuario = await Usuario.findById(req.params.id);
      if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      Object.assign(usuario, datos, { contraseña });
      await usuario.save();
      return res.json(await Usuario.findById(usuario._id).select('-contraseña'));
    }

    const actualizado = await Usuario.findByIdAndUpdate(req.params.id, datos, {
      new: true,
      runValidators: true
    }).select('-contraseña');
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