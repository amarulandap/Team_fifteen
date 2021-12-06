const Usuario = require ('../models/modeloUsuario')
const Proyecto = require('../models/modeloProyecto')


const addUserProject = async (identificacion, nombreDelProyecto) => {
    const user = await Usuario.findOne({ identificacion })
    if (user && user.estado === "Autorizado") {
        const project = await Proyecto.findOne({ nombre: nombreDelProyecto })
        if (project && project.estadoProyecto==true) {
            if (project.estudiantesInscritos.find(i => i === user._id)) {
                return "El usuario ya pertenece al proyecto indicado"
            } else {
                await Proyecto.updateOne({ nombre: nombreDelProyecto }, { $push: { estudiantesInscritos: user._id } })
                return "Usuario adicionado correctamente"   
            }
        } else {
            return "Proyecto no valido para adicionar un integrante, consulte al administrador"
        }
    } else {
        return "Usuario no valido"
    }

}

module.exports = { 
    addUserProject,
};
