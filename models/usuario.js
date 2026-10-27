const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    correo: { type: String, required: true, unique: true, trim: true, lowercase: true },
    contraseña: { type: String, required: true },
    telefono: { type: String, trim: true },
    rol: { type: String, enum: ['admin', 'cliente'], default: 'cliente' }
  },
  { timestamps: true }
);

// Hashea la contraseña automáticamente antes de guardar (solo si cambió)
usuarioSchema.pre('save', async function (next) {
  if (!this.isModified('contraseña')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.contraseña = await bcrypt.hash(this.contraseña, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compara una contraseña en texto plano con la almacenada (hasheada)
usuarioSchema.methods.compararContraseña = function (contraseñaPlano) {
  return bcrypt.compare(contraseñaPlano, this.contraseña);
};

module.exports = mongoose.model('Usuario', usuarioSchema);