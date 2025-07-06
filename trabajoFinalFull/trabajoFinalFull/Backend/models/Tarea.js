const mongoose = require('mongoose');

const tareaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  completada: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true 
});

module.exports = mongoose.model('Tarea', tareaSchema);