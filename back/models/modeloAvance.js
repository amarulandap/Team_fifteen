const { Schema, model } = require('mongoose');

const avance = new Schema({
    idAvance: {
        type: String,
        required: true,
        unique: true
    },
    idProyecto: {
        type: String,
        required: true
    },
    fechaAvance: {
        type: Date,
        default: new Date()
    },
    descripcion: String,
    observaciones: String
});
module.exports = model('avances', avance, "avances");