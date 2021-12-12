require('./infraestructura/conexionbbdd');

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
            resolvers
        }
    );
    await apollo.start();
    apollo.applyMiddleware({ app: api });
    /*api.use((request, response) => {
        response.send('Hola')
    })*/
    api.use(express.json())
    api.use('/api', authRoute)
    api.listen ('9092', ()=> console.log('Inició el servidor'))
}

iniciarServidor();








