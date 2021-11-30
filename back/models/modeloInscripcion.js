const { Schema, model } = require('mongoose');

const inscripcion = new Schema({
    idInscripcion: {
        type: String,
        required: true,
        unique: true
    },
    idProyecto: {
        type: String,
        required: true
    },
    identificacion: {
        type: String,
        required: true
    },
    estadoInscripcion: {
        type: String,
        default: "Pendiente"
    },
    fechaIngreso: {
        type: Date,
        default: new Date()
    },
    fechaEgreso: {
        type: Date,
        default: new Date()
    }
});
module.exports = model('inscripciones', inscripcion, "inscripciones");