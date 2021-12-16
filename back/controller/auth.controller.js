const Usuario = require('../models/modeloUsuario')
let aes256 = require('aes256');
const jwt = require('jsonwebtoken');
const key = 'CLAVESISTEMA';


const singIn = async(request, response) => {
try{
    console.log("Autenticando...")
    //Verifica que el correo esté registrado
    const usuario = await Usuario.findOne({correoElectronico: request.body?.correoElectronico})
    if (!usuario) {
        return response.status(401).json({response: "Verifique sus datos."})
    }
    //Verifica que la contraseña sea correcta
    const claveDesencriptada = aes256.decrypt(key, usuario.contrasegna)
    if(request.body?.contrasegna != claveDesencriptada) {
        return response.status(401).json({response: "Verifique sus datos."})
    }
    //Firmar el jwt con el rol para verificar accesos, otorgar tiempo de validez del token (segundos*segundos*criterio)
    const token = jwt.sign({
        role: usuario.rol
    }, key, {expiresIn: 60 * 60 * 2} )

    response.status(200).json({jwt: token})

} catch(error) {
    console.log(error)
    response.status(500).json({response:"Contacte al administrador."})
}

    
}

module.exports = singIn