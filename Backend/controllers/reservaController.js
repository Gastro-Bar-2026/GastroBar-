const Reserva = require('../models/reserva');
const Servicio = require('../models/servicio');

// HUS-06: Crear reserva
exports.crearReserva = async (req, res) => {
  try {
    const { servicio, fecha, numeroPersonas, notas } = req.body;
    
    // Obtenemos el id del usuario que inició sesión desde el middleware de auth
    const usuarioId = req.usuario ? (req.usuario.id || req.usuario._id) : null;

    if (!usuarioId) {
      return res.status(401).json({ mensaje: 'No autorizado, usuario no identificado' });
    }

    if (!servicio || !fecha) {
      return res.status(400).json({ mensaje: 'El servicio y la fecha son campos requeridos' });
    }
    const fechaReserva = new Date(fecha);
    if (Number.isNaN(fechaReserva.getTime()) || fechaReserva <= new Date()) {
      return res.status(400).json({ mensaje: 'La fecha de la reserva debe ser futura' });
    }
    if (numeroPersonas !== undefined && (!Number.isInteger(Number(numeroPersonas)) || Number(numeroPersonas) < 1 || Number(numeroPersonas) > 20)) {
      return res.status(400).json({ mensaje: 'El número de personas debe estar entre 1 y 20' });
    }

    // Validamos que el servicio seleccionado exista en la base de datos
    const servicioExiste = await Servicio.findById(servicio);
    if (!servicioExiste) {
      return res.status(404).json({ mensaje: 'El servicio seleccionado no existe' });
    }
    if (!servicioExiste.disponible) {
      return res.status(400).json({ mensaje: 'El servicio seleccionado no está disponible' });
    }

    // Creamos la nueva reserva
    const nuevaReserva = new Reserva({
      usuario: usuarioId,
      servicio,
      fecha: fechaReserva,
      numeroPersonas: numeroPersonas || 1,
      estado: 'confirmada',
      notas
    });

    const reservaGuardada = await nuevaReserva.save();
    
    // Poblamos los datos para devolver la información completa
    await reservaGuardada.populate('servicio', 'nombre precio');

    return res.status(201).json({
      mensaje: 'Reserva registrada exitosamente',
      reserva: reservaGuardada
    });
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Error al registrar la reserva',
      error: error.message
    });
  }
};





// HUS-07: Consultar reservas
exports.obtenerReservas = async (req, res) => {
  try {
    const usuarioId = req.usuario ? (req.usuario.id || req.usuario._id) : null;
    const esAdmin = req.usuario && req.usuario.rol === 'admin';

    // Si es administrador puede ver todas; si es cliente solo las que él registró
    const filtro = esAdmin ? {} : { usuario: usuarioId };

    const reservas = await Reserva.find(filtro)
      .populate('servicio', 'nombre precio descripcion')
      .populate('usuario', 'nombre correo')
      .sort({ fecha: 1 });

    return res.status(200).json({
      total: reservas.length,
      reservas
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Error al consultar las reservas',
      error: error.message
    });
  }
};



// HUS-08: Actualizar reserva
exports.actualizarReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha, numeroPersonas, notas, estado } = req.body;
    const usuarioId = req.usuario ? (req.usuario.id || req.usuario._id) : null;
    const esAdmin = req.usuario && req.usuario.rol === 'admin';

    // Buscar si la reserva existe
    const reserva = await Reserva.findById(id);
    if (!reserva) {
      return res.status(404).json({ mensaje: 'Reserva no encontrada' });
    }

    // Un cliente solo puede editar sus propias reservas
    if (!esAdmin && reserva.usuario.toString() !== usuarioId.toString()) {
      return res.status(403).json({ mensaje: 'No tienes permiso para modificar esta reserva' });
    }

    // Validar fecha futura si se intenta modificar
    if (fecha) {
      const fechaNueva = new Date(fecha);
      if (isNaN(fechaNueva.getTime()) || fechaNueva <= new Date()) {
        return res.status(400).json({ mensaje: 'La fecha de la reserva debe ser futura' });
      }
      reserva.fecha = fechaNueva;
    }

    if (numeroPersonas !== undefined) {
      if (!Number.isInteger(Number(numeroPersonas)) || Number(numeroPersonas) < 1 || Number(numeroPersonas) > 20) {
        return res.status(400).json({ mensaje: 'El número de personas debe estar entre 1 y 20' });
      }
      reserva.numeroPersonas = Number(numeroPersonas);
    }
    if (notas !== undefined) reserva.notas = notas;
    if (estado !== undefined) {
      if (!esAdmin) {
        return res.status(403).json({ mensaje: 'Solo un administrador puede cambiar el estado de la reserva' });
      }
      if (!['pendiente', 'confirmada', 'cancelada'].includes(estado)) {
        return res.status(400).json({ mensaje: 'El estado de la reserva no es válido' });
      }
      reserva.estado = estado;
    }

    await reserva.save();

    return res.status(200).json({
      mensaje: 'Reserva actualizada exitosamente',
      reserva
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Error al actualizar la reserva',
      error: error.message
    });
  }
};



// HUS-09: Cancelar / Eliminar reserva
exports.eliminarReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario ? (req.usuario.id || req.usuario._id) : null;
    const esAdmin = req.usuario && req.usuario.rol === 'admin';

    // Verificar si la reserva existe
    const reserva = await Reserva.findById(id);
    if (!reserva) {
      return res.status(404).json({ mensaje: 'Reserva no encontrada' });
    }

    // Un cliente solo puede eliminar sus propias reservas
    if (!esAdmin && reserva.usuario.toString() !== usuarioId.toString()) {
      return res.status(403).json({ mensaje: 'No tienes permiso para eliminar esta reserva' });
    }

    await Reserva.findByIdAndDelete(id);

    return res.status(200).json({
      mensaje: 'Reserva cancelada y eliminada exitosamente',
      idEliminado: id
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Error al eliminar la reserva',
      error: error.message
    });
  }
};