const { Schema, model } = require('mongoose');

const usuario = new Schema({
    identificacion: {
        type: Number,
        unique: true,
        required: true
    },
    nombre: {
        type: String,
        required: true
    }, 
    apellido: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        required: true
    },
    correoElectronico: {
        type: String,
        required: true
    },
    contrasegna: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        default: "Pendiente"
    },
});
// Asignamos a cada una de las colecciones su modelo respectivo y lo exportamos
module.exports = model('usuarios', usuario, "usuarios")








