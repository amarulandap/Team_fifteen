const { Schema, model } = require('mongoose');

const avance = new Schema({
    idProyecto: {
        type: String,
        required: true
      },
    fechaAvance: {
        type: Date,
        default: new Date()
    },
    descripcion: String,
    observaciones: String,
    estudiantesInscritos: [{
        type: Schema.Types.ObjectId,
        ref: "usuarios",
        required: true
      }],
});
module.exports = model('avances', avance, "avances");