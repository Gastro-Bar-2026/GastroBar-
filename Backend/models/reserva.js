const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: [true, 'El usuario es obligatorio']
    },
    servicio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Servicio',
      required: [true, 'El servicio es obligatorio']
    },
    fecha: {
      type: Date,
      required: [true, 'La fecha y hora de la reserva son obligatorias'],
      validate: {
        validator: function (v) {
          return v > new Date(); // Valida que la fecha sea en el futuro
        },
        message: 'La fecha de la reserva debe ser posterior a la fecha y hora actual'
      }
    },
    numeroPersonas: {
      type: Number,
      default: 1,
      min: [1, 'Debe reservar para al menos 1 persona']
    },
    estado: {
      type: String,
      enum: ['pendiente', 'confirmada', 'cancelada'],
      default: 'pendiente'
    },
    notas: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Reserva', reservaSchema);