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

    // Validamos que el servicio seleccionado exista en la base de datos
    const servicioExiste = await Servicio.findById(servicio);
    if (!servicioExiste) {
      return res.status(404).json({ mensaje: 'El servicio seleccionado no existe' });
    }

    // Creamos la nueva reserva
    const nuevaReserva = new Reserva({
      usuario: usuarioId,
      servicio,
      fecha: new Date(fecha),
      numeroPersonas: numeroPersonas || 1,
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