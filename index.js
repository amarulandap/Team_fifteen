require('./infraestructura/conexionbbdd');

const { validarToken, admin, estudiante } = require('./middleware/authjwt')
const jwt = require('jsonwebtoken')

const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const typeDefs = require('./typeDef');
const resolvers = require('./resolver');
const authRoute = require('./routes/auth.routes');

const iniciarServidor = async () => {
    const api = express();
    const apollo = new ApolloServer(
        {
            typeDefs,
            resolvers,
            context: ({ req }) => {
                const token = req.headers.authorization;
                if(token){
                    try {
                        const rol = jwt.verify(token, key)
                        if (rol) {
                            rol = rol.role
                            return {rol}
                        }
                    } catch (error) {
                        console.log(error)
                    }
                    return {}
                }
            }
        });
    await apollo.start();
    apollo.applyMiddleware({ app: api });
    api.use(express.json())
    api.use('/api', authRoute)
    api.get('/api/dashboard/admin', [validarToken, admin], (request, response) => {
        response.json("Soy el dashboard")
    })

    api.get("/healt-check", (req,resp)=>{
        resp.json("ok")
    })

    api.get('/api/dashboard/estudiante', [validarToken, estudiante], (request, response) => {
        response.json("Soy el dashboard")
    })
    api.listen ('9092', ()=> console.log('Inició el servidor'))
}

iniciarServidor();

//module.exports = api








