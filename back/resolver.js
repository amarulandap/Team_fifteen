//usuarios es la función para la consulta de todos los usuarios registrados en el sistema.
//crearUsuarios permite el registro de nuevos usuarios en el sistema.

/*const usuarios = require('./service/usuario.service');*/
const User = require('./models/modeloUsuario');
const Project = require('./models/modeloProyecto');
let aes256 = require('aes256');

const key = 'CLAVESISTEMA';

const usuarios = async () => await User.find({});
const proyectos = async () => await Project.find({});

const resolvers = {
    Query: {
        consultaUsuarios: async () => usuarios(),
        consultaProyectos: async () => proyectos(),
    },

    Mutation: {
        crearUsuario: (parent, args, context, info) => {
            const { contrasegna } = args.usuarioSistema;
            const nuevoUsuario = new User(args.usuarioSistema);
            const encriptado = aes256.encrypt(key, contrasegna);
            nuevoUsuario.contrasegna = encriptado;
            return nuevoUsuario.save()
                .then(u => "usuario creado")
                .catch(err => console.log(err));
        },

        aceptarUsuario: (parent, args, context, info) => {
            return User.updateOne({ identificacion:args.identificacion }, { estado: "Autorizado" })
            .then(u => "El estado ha cambiado")
            .catch(err => console.log(err));
        },

        aprobarProyecto: (parent, args, context, info) => {
            return Project.updateOne({ idProyecto:args.idProyecto }, { estadoProyecto: true })
                .then(u => "El estado del proyecto ha sido modificado")
                .catch(err => console.log(err));
        },
    }
}

module.exports = resolvers;