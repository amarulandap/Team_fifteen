const { Schema, model } = require('mongoose');

const proyecto = new Schema({
    idProyecto: {
        type: String,
        required: true,
        unique: true
    },
    nombreDelProyecto: {
        type: String,
        required: true,
        unique: true
    },
    objetivosGenerales: [String],
    objetivosEspecificos: [String],
    presupuesto: {
        type: Number,
        required: true
    },
    fechaInicio: {
        type: Date,
        default: new Date()
    },
    fechaTerminacion: {
        type: Date,
        default: null //Lo cambié de new date a null
    },
    idDelLider: {
        type: Number,
        required: true
    },
    nombreLider: {
        type: String,
        required: true
    },
    facultad: {
        type: String,
        required: true
    },
    estadoProyecto: {
        type: Boolean,
        default: false
    },
    faseProyecto: {
        type: String,
        default: null
    },
    estudiantesInscritos: [{
        type: Schema.Types.ObjectId,
        ref: "usuarios"
        }],
    /* estudiantesInscritos: [{
        type: Number,
        required: true
        }],
        /*integrantes: [{
        type: Schema.Types.ObjectId,
        ref: "usuarios"
        }]*/
        /*nombre: {
        type: String,
        required: true
        },
        apellido: {
        type: String,
        required: true
        },
    }*/
},
{
    timestamps: true
});
module.exports = model('proyectos', proyecto, "proyectos");