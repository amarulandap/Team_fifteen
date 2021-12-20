const inscripcion = require ('../models/modeloInscripcion')

const inscript = async () => await inscripcion.find({})

module.exports = { 
    inscript
};
