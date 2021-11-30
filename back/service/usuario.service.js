const User = require('../models/modeloUsuario');

const usuarios = async () => await User.find({})


/*const buscarUsuarioPorIdentificacion = (identi) => listUsuarios.find(user => user.identificacion === identi);*/

module.exports = { usuarios };
