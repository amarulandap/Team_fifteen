const jwt = require('jsonwebtoken')
const key = 'CLAVEDIFICIL';

const validarToken = (request, response, next) => {
    const token = request.headers['authorization']
    if (!token) {
        return response.status(401).json({ response: "Token invalido" })
    }
    try {
        const rol = jwt.verify(token, key)
        if (rol) {
            request.rol = rol.role
            next();
            return
        }
        return response.status(401).json({ response: "Token invalido" })
    } catch (error) {
        return response.status(401).json({ response: "Token invalido" })
    }
}
const admin = (request, response, next) => {
    if (request.rol != "Administrador") {
        return response.status(403).json({ response: "Permisos insuficientes" })
    }
    next();
}
const isLider = (rol) => {
    return rol === "Lider"
}
const isAdmin = (rol) => {
    return rol === "Administrador"
}

const estudiante = (request, response, next) => {
    if (request.rol != "Estudiante") {
        return response.status(403).json({ response: "Permisos insuficientes" })
    }
    next();
}
module.exports = {
    validarToken,
    admin,
    estudiante,
    isAdmin,
    isLider
}