//usuarios es la función para la consulta de todos los usuarios registrados en el sistema.
//crearUsuarios permite el registro de nuevos usuarios en el sistema.

/*const usuarios = require('./service/usuario.service');*/
const { usuarios, listarEstudiantes } = require('./service/usuario.service')
const { addUserProject, createAdvance, getAdvance, advance } = require('./service/avance.service')
const {inscript} = require('./service/inscripciones.service');
const User = require('./models/modeloUsuario');
const Project = require('./models/modeloProyecto');
const Avance = require('./models/modeloAvance');
const Inscription = require('./models/modeloInscripcion');
let aes256 = require('aes256');
const { isLider } = require('./middleware/authjwt');
const jwt = require('jsonwebtoken')

const key = 'CLAVESISTEMA';


const proyectos = async () => await Project.find({}).populate("estudiantesInscritos");


const resolvers = {
    Query: {
        consultaUsuarios: async () => usuarios(),
        consultaProyectos: async () => proyectos(),
        filtroInscripciones: async () => inscript(),
        obtenerEstudiantes: async (parent, args, context, info) => listarEstudiantes(args.rol),
        proyectAvanc: async () => await Project.find({}).populate("avances"),
        filtroAvances: async() => advance(),
        buscarProyectoPorLider: async (parent, args, context, info) => {
            return Project.find({ nombreLider: args.nombreLider }).populate("estudiantesInscritos")
        },
        inscripcionesPendientes: async (parent, args, context, info) => {
            return Inscription.find({ estadoInscripcion: "Pendiente" })
        },
        getAdvance: async (parent, args, context, info) => getAdvance(args.idProyecto),
        filtrarProyectos: async(parent, args, context, info) => proyectos(),
    },

    Mutation: {
        cambiarInscripcion: async (parent, args, context, info) => {
            const insc = await Inscription.findOne({ idInscripcion: args.idInscripcion })
            if (insc.estadoInscripcion === "Pendiente") {
                return Inscription.updateOne({ idInscripcion: args.idInscripcion }, { estadoInscripcion: "Aceptado" })
                    .then(u => "la inscripcion ha sido modificado")
                    .catch(err => console.log(err));
            }
        },

        cambiarInscripcionR: async (parent, args, context, info) => {
            const insc = await Inscription.findOne({ idInscripcion: args.idInscripcion })
            if (insc.estadoInscripcion === "Pendiente") {
                return Inscription.updateOne({ idInscripcion: args.idInscripcion }, { estadoInscripcion: "Rechazado" })
                        .then(u => "la inscripcion ha sido modificado")
                        .catch(err => console.log(err));
            }
        },


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
        activeUser: (parent, args, context, info) => {
            if (isLider(context.rol)) {
                return User.updateOne({ identificacion: args.identificacion }, { estado: "Activo" })
                    .then(u => "Usuario activo")
                    .catch(err => "Fallo la activacion");
            }
        },
        deleteUser: (parent, args, context, info) => {
            if (isLider(context.rol)) {
                return User.deleteOne({ identificacion: args.ident })
                    .then(u => "Usuario eliminado")
                    .catch(err => "Fallo la eliminacion");
            }
        },
        aceptarUsuario: (parent, args, context, info) => {
            return User.updateOne({ identificacion: args.identificacion }, { estado: "Autorizado" })
                .then(u => "El estado ha cambiado")
                .catch(err => console.log(err));
        },
        editarUsuario: async (parent, args) => {
            
           const usuario = await User.findOne({ identificacion: args.identificacion})
           const editar = await User(args.usuario)
           await User.findOneAndUpdate({ identificacion: usuario.identificacion,}, { nombre: editar.nombre, apellido: editar.apellido, correoElectronico: editar.correoElectronico}, { upsert: false })
            return ("Usuario actualizado.")
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
        autenticar: async (parent, args, context, info) => {
            try {
                const usuario = await User.findOne({ correoElectronico: args.correoElectronico })
                if (!usuario) {
                    return {
                        status: 401
                    }
                }
                //AES256 es una libreria de criptografia para encriptar y desencriptar.
                const claveDesencriptada = aes256.decrypt(key, usuario.contrasegna)
                if (args.contrasegna != claveDesencriptada) {
                    return {
                        status: 401
                    }
                }
                const token = jwt.sign({
                    role: usuario.rol
                }, key, { expiresIn: 60 * 60 * 2 })

                return {
                    status: 200,
                    jwt: token
                }

            } catch (error) {
                console.log(error)
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
            } else if (proyecto.faseProyecto === "Inicial") {
                return Project.updateOne({ idProyecto: args.idProyecto }, { faseProyecto: "En desarrollo" })
                    .then(u => "El estado del proyecto ha sido modificado")
                    .catch(err => console.log(err));
            } else {
                return
            }
        },

        aprobarInscripcion: async (parent, args) => {
            const inscripcionesAprobada = await Inscription.findByIdAndUpdate(
              args.id,
              {
                estadoInscripcion: 'Aceptado',
                fechaIngreso: Date.now(),
              },
              { new: true }
              );
            return inscripcionesAprobada;
        },

        rechazarInscripcion: async (parent, args) => {
            const lider = await Project.findOne({idLider: args.idLider})
            if(lider){
            const Inscription = await Inscription.findByIdAndUpdate(
              args.idInscripcion,
              {
                estadoInscripcion: 'rechazado',
                fechaIngreso: Date.now(),
              },
              { new: true })};
            
            return ("Inscripcion rechazada");
        },

        insertUserToProject: async (parent, args, context, info) => addUserProject(args.identificacion, args.nombreDelProyecto),
        createAdvance: (parent, args, context, info) => createAdvance(args.advance),

        actualizarAvance: async (parent, args, context, info) => {
            const user = await User.findOne({ identificacion: args.identificacion })
            if (user && user.estado === "Autorizado") {
                const project = await Project.findOne({ nombreDelProyecto: args.nombreDelProyecto })
                if (project && project.estadoProyecto == true) {
                    await Avance.updateOne({ idAdvance: args._id }, { $set: { descripcion: args.descripcion } })

                    return ("El avance fue actualizado correctamente")
                }else{
                    return("El proyecto no se encuentra activo")
                }
            }else{
                    return("El usuario no se encuentra autorizado")
            }
        },
        agregarObservacion: async (parent, args) => {
            const lider = await Project.findOne({idLider: args.idLider})
            if(lider){
            const avanceObser= await Advance.findByIdAndUpdate(
              args.idProyecto,
              {
                $set: {
                  observaciones: args.observaciones,
                },
              },
              { new: true }
            );

            return ("observacion creada");
          }
        }


    }
}

module.exports = resolvers;