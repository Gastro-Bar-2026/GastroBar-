const Servicio = require('../models/servicio');

// Crear servicio
exports.crearServicio = async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoria, disponible } = req.body;
    if (!nombre || precio === undefined || !categoria) {
      return res.status(400).json({ mensaje: 'Nombre, precio y categoría son obligatorios' });
    }
    const nuevoServicio = new Servicio({ nombre, descripcion, precio, categoria, disponible });
    await nuevoServicio.save();
    res.status(201).json(nuevoServicio);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al registrar servicio', error: error.message });
  }
};

// Obtener todos
exports.obtenerServicios = async (req, res) => {
  try {
    const filtro = {};
    if (req.query.categoria) filtro.categoria = req.query.categoria;
    const servicios = await Servicio.find(filtro);
    res.json(servicios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener servicios', error: error.message });
  }
};

// Obtener por ID
exports.obtenerServicioPorId = async (req, res) => {
  try {
    const servicio = await Servicio.findById(req.params.id);
    if (!servicio) return res.status(404).json({ mensaje: 'Servicio no encontrado' });
    res.json(servicio);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al consultar servicio', error: error.message });
  }
};

// Actualizar
exports.actualizarServicio = async (req, res) => {
  try {
    const actualizado = await Servicio.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!actualizado) return res.status(404).json({ mensaje: 'Servicio no encontrado' });
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar servicio', error: error.message });
  }
};

// Eliminar
exports.eliminarServicio = async (req, res) => {
  try {
    const eliminado = await Servicio.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ mensaje: 'Servicio no encontrado' });
    res.json({ mensaje: 'Servicio eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar servicio', error: error.message });
  }
};