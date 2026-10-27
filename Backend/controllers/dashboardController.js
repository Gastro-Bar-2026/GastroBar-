const Servicio = require('../models/servicio');
const Usuario = require('../models/usuario');

exports.obtenerEstadisticas = async (req, res) => {
  try {
    const [
      totalUsuarios,
      totalClientes,
      totalAdministradores,
      totalServicios,
      serviciosDisponibles,
      serviciosNoDisponibles
    ] = await Promise.all([
      Usuario.countDocuments(),
      Usuario.countDocuments({ rol: 'cliente' }),
      Usuario.countDocuments({ rol: 'admin' }),
      Servicio.countDocuments(),
      Servicio.countDocuments({ disponible: true }),
      Servicio.countDocuments({ disponible: false })
    ]);

    res.json({
      usuarios: {
        total: totalUsuarios,
        clientes: totalClientes,
        administradores: totalAdministradores
      },
      servicios: {
        total: totalServicios,
        disponibles: serviciosDisponibles,
        noDisponibles: serviciosNoDisponibles
      }
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener las estadísticas del dashboard',
      error: error.message
    });
  }
};
