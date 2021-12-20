//Después de instalar mongoose, lo importamos. 
const mongoose = require('mongoose');

//Creamos una variable para la conexión a la BBDDD.
const urlDB= 'mongodb+srv://amarulandap:Carolina1998@proyectomintic.ampme.mongodb.net/testAndres?retryWrites=true&w=majority';
mongoose.connect(urlDB);

//Guardamos la conexión
const mongoDB = mongoose.connection;
mongoDB.on('open', _ => {
    console.log('conectado a la BBDD')
});