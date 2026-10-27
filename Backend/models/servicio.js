const mongoose = require('mongoose');

const servicioSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    descripcion: { type: String, trim: true },
    precio: { type: Number, required: true, min: 0 },
    categoria: {
      type: String,
      required: true,
      enum: ['Coctelería', 'Bebidas', 'Comida', 'Reserva de Mesa', 'Evento Especial', 'Otro']
    },
    disponible: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Servicio', servicioSchema);