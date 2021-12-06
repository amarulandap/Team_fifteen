//usuarios es la función para la consulta de todos los usuarios registrados en el sistema.
//crearUsuarios permite el registro de nuevos usuarios en el sistema.

/*const usuarios = require('./service/usuario.service');*/
const { usuarios, listarEstudiantes } = require('./service/usuario.service')
const { addUserProject, createAdvance, getAdvance } = require('./service/avance.service')
const User = require('./models/modeloUsuario');
const Project = require('./models/modeloProyecto');
const Advance = require('./models/modeloAvance')
const Inscription = require('./models/modeloInscripcion')
let aes256 = require('aes256');

const key = 'CLAVESISTEMA';

//const usuarios = async () => await User.find({});
const proyectos = async () => await Project.find({});

const resolvers = {
    Query: {
        consultaUsuarios: async () => usuarios(),
        consultaProyectos: async () => proyectos(),
        obtenerEstudiantes: async (parent, args, context, info) => listarEstudiantes(args.rol),
        buscarProyectoPorLider: async (parent, args, context, info) => {
            return Project.find({ nombreLider: args.nombreLider })
        },
        inscripcionesPendientes: async (parent, args, context, info) => {
            return Inscription.find({ estadoInscripcion: "Pendiente" })
        },
        getAdvance: async (parent, args, context, info) => getAdvance(args.idProyecto)
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
        crearProyecto: async (parent, args, context, info) => {
            const nuevoProyecto = new Project(args.proyecto);
            return nuevoProyecto.save()
                .then(u => "Proyecto creado")
                .catch(err => "Falló la creación del proyecto. Verifique la información ingresada.")
        },
        aceptarUsuario: (parent, args, context, info) => {
            return User.updateOne({ identificacion: args.identificacion }, { estado: "Autorizado" })
                .then(u => "El estado ha cambiado")
                .catch(err => console.log(err));
        },
        aprobarProyecto: (parent, args, context, info) => {
            return Project.updateOne({ idProyecto: args.idProyecto }, { faseProyecto: "Inicial" })
                .then(u => "El estado del proyecto ha sido modificado")
                .catch(err => console.log(err));
        },

        activarProyecto: async (parent, args, context, info) => {
            const proyecto = await Project.findOne({ idProyecto: args.idProyecto })
            if (proyecto.estadoProyecto === true) {
                return Project.updateOne({ idProyecto: args.idProyecto }, { estadoProyecto: false })
                    .then(u => "El estado del proyecto ha sido modificado")
                    .catch(err => console.log(err));
            } else {
                return Project.updateOne({ idProyecto: args.idProyecto }, { estadoProyecto: true })
                    .then(u => "El estado del proyecto ha sido modificado")
                    .catch(err => console.log(err));
            }

        },
        actualizarProyecto: async (parent, args, context, info) => {
            const lider = await Project.findOne({ idLider: args.idLider })
            if (lider) {
                const proyecto = await Project.findOne({ idProyecto: args.idProyecto })
                if (proyecto && proyecto.estadoProyecto === false) {
                    return ("El proyecto seleccionado no se encuentra activo.")
                }
                else {
                    const modificar = await Project(args.proyecto)
                    await Project.findOneAndUpdate({ idLider: lider.idLider, idProyecto: proyecto.idProyecto }, { nombreDelProyecto: modificar.nombreDelProyecto, objetivosGenerales: modificar.objetivosGenerales, objetivosEspecificos: modificar.objetivosEspecificos, presupuesto: modificar.presupuesto }, { upsert: false })

                    return ("Proyecto actualizado.")
                }
            }
            else {
                return ("No fue posible actualizar el proyecto")
            }
        },

        cambiarFaseProyecto: async (parent, args, context, info) => {
            const proyecto = await Project.findOne({ idProyecto: args.idProyecto })
            if (proyecto.faseProyecto === "En desarrollo") {
                return Project.updateOne({ idProyecto: args.idProyecto }, { faseProyecto: "Terminado" })
                    .then(u => "El estado del proyecto ha sido modificado")
                    .catch(err => console.log(err));
            } else if (proyecto.faseProyecto === "Iniciado") {
                return Project.updateOne({ idProyecto: args.idProyecto }, { faseProyecto: "En desarrollo" })
                    .then(u => "El estado del proyecto ha sido modificado")
                    .catch(err => console.log(err));
            } else {
                return
            }
        },

        insertUserToProject: async (parent, args, context, info) => addUserProject(args.identificacion, args.nombreDelProyecto),
        createAdvance: (parent, args, context, info) => createAdvance(args.advance),

        actualizarAvance: async (parent, args, context, info) => {
            const user = await User.findOne({ identificacion: args.identificacion })
            if (user && user.estado === "Autorizado") {
                const project = await Project.findOne({ nombreDelProyecto: args.nombreDelProyecto })
                if (project && project.estadoProyecto == true) {
                    await Advance.updateOne({ idAdvance: args._id }, { $set: { descripcion: args.descripcion } })
                    return ("El avance fue actualizado correctamente")
                }else{
                    return("El proyecto no se encuentra activo")
                }
            }else{
                    return("El usuario no se encuentra autorizado")
                }
                    // if(estudiante){  
                    //     const proyecto = await Advance.findOne({idProyect: args.idProyecto})
                    //     if (proyecto && proyecto.estadoProyecto===false){
                    //         return("El proyecto seleccionado no se encuentra activo.")
                    //     }
                    //     else{
                    //         const modificar = await Project(args.proyecto)
                    //             await Project.findOneAndUpdate({idLider: lider.idLider, idProyecto: proyecto.idProyecto}, { nombreDelProyecto: modificar.nombreDelProyecto, objetivosGenerales: modificar.objetivosGenerales, objetivosEspecificos: modificar.objetivosEspecificos, presupuesto: modificar.presupuesto},{upsert: false})

                    //             return("Proyecto actualizado.")
                    //     }                    
                    // }
                    // else{
                    //     return("No fue posible actualizar el proyecto")
                    // }
                },

            }
        }

module.exports = resolvers;