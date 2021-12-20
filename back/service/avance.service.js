const Usuario = require ('../models/modeloUsuario')
const Proyecto = require('../models/modeloProyecto')
const Advance = require('../models/modeloAvance')

const addUserProject = async (identificacion, nombreDelProyecto) => {
    const user = await Usuario.findOne({ identificacion })
    if (user && user.estado === "Autorizado") {
        const project = await Proyecto.findOne({ nombreDelProyecto: nombreDelProyecto })
        if (project && project.estadoProyecto==true) {
            if (project.estudiantesInscritos.find(i => i === user._id)) {
                return "El usuario ya pertenece al proyecto indicado"
            } else {
                await Proyecto.updateOne({ nombreDelProyecto: nombreDelProyecto }, { $push: { estudiantesInscritos: user._id } })
                return "Usuario adicionado correctamente"   
            }
        } else {
            return "Proyecto no valido para adicionar un integrante, consulte al administrador"
        }
    } else {
        return "Usuario no valido"
    }

}

const createAdvance = (advance) => {
    const nuevoAvance = new Advance(advance);
    return nuevoAvance.save()
        .then(u => "Avance registrado correctamente")
        .catch(err => console.log(err));
}

const getAdvance = async (idProyecto) => await Advance.find({ idProyecto })

module.exports = { 
    addUserProject,
    createAdvance,
    getAdvance
};
