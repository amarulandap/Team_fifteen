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
        estadoProyecto: String
        faseProyecto: String
        estudiantesInscritos: [Int]
    }
    type Query {
        consultaUsuarios: [Usuario]
        consultaProyectos: [Proyecto]
        obtenerEstudiantes( rol: String ): [Usuario]
    }

    input ingresarUsuario {
        identificacion: Int
        nombre: String
        apellido: String
        rol: String
        correoElectronico: String
        contrasegna: String
        estado: String
    }
    
    type Mutation {
        crearUsuario (usuarioSistema:ingresarUsuario): String
        aceptarUsuario (identificacion: Int): String
        aprobarProyecto (idProyecto: String): String
    }
`

module.exports = typeDefs;