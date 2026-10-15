const jwt = require('jsonwebtoken');


const verificarToken = (req, res, next) => {
  const header = req.headers.authorization || '';
  const [tipo, token] = header.split(' ');

  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload; // { id, rol, iat, exp }
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
};

const autorizarRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ mensaje: 'No tienes permisos para esta acción' });
    }
    next();
  };
};

module.exports = { verificarToken, autorizarRol };
