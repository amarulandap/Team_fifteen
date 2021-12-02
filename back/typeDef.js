//Despúes de instalar apollo server express importamos la función gql.
//Input usuarioCreado: Registro de un nuevo usuario en el sistema.
//Type Usuario es para coaultar toda la info de los usuarios registrados.

const { gql } = require('apollo-server-express');

const typeDefs = gql `

    scalar Date

    type Usuario {
        identificacion: Int
        nombre: String
        apellido: String
        rol: String
        correoElectronico: String
        estado: String
    }
    type Proyecto {
        idProyecto: String
        nombreDelProyecto: String
        objetivosGenerales: [String]
        objetivosEspecificos: [String]
        presupuesto: Int
        fechaInicio: Date
        fechaTerminacion: Date
        idDelLider: Int
        nombreLider: String
        facultad: String
        estadoProyecto: String
        faseProyecto: String
        estudiantesInscritos: [Int]
    }

    type Inscripcion{
        idInscripcion: String
        idProyecto: String
        identificacion: Int
        estadoInscripcion: String
        fechaIngreso: Date
        fechaEgreso: Date
    }
    type Query {
        consultaUsuarios: [Usuario]
        consultaProyectos: [Proyecto]
        obtenerEstudiantes( rol: String ): [Usuario]
        buscarProyectoPorLider(nombreLider: String): [Proyecto]
        inscripcionesPendientes(estadoInscripcion: String): [Inscripcion]

    input ingresarUsuario {
        identificacion: Int
        nombre: String
        apellido: String
        rol: String
        correoElectronico: String
        contrasegna: String
        estado: String
    }
    input datosProyecto{
        idProyecto: String
        nombreDelProyecto: String
        objetivosGenerales: [String]
        objetivosEspecificos: [String]
        presupuesto: Int
        fechaInicio: Date
        fechaTerminacion: Date
        nombreLider: String
        idDelLider: Int
        facultad: String
        estadoProyecto: Boolean
        faseProyecto: String
        estudiantesInscritos: [Int]
    }

    input datosActualizarProyecto{
        nombreDelProyecto: String
        objetivosGenerales: String
        objetivosEspecificos: String
        presupuesto: Int
    }

    type Mutation {
        crearUsuario (usuarioSistema:ingresarUsuario): String
        crearProyecto(proyecto: datosProyecto): String
        aceptarUsuario (identificacion: Int): String
        aprobarProyecto (idProyecto: String): String
        activarProyecto (idProyecto: String): String
<<<<<<< HEAD
        actualizarProyecto(idLider: Int, idProyecto: String, proyecto: datosActualizarProyecto): String
=======
>>>>>>> 1a2b200 (Se modifico aprobarProyecto y se crearon activarProyecto y cambiarFaseProyecto dentro de Mutation)
        cambiarFaseProyecto (idProyecto: String): String
    }
`

module.exports = typeDefs;