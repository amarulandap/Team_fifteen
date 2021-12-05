const User = require('../models/modeloUsuario');

const usuarios = async () => await User.find({})
const listarEstudiantes = async (rol) => await User.find({rol})

/*const buscarUsuarioPorIdentificacion = (identi) => listUsuarios.find(user => user.identificacion === identi);*/

module.exports = { 
    usuarios,
    listarEstudiantes
};
