const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const validateJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token');
    if (!token) return res.status(401).json({ msg: 'ocupamos el token mijo' });

    try {
        //si el jwt.verify() es inválido entonces arroja un error por eso se 
        //envuelve en try cathc y no se hace con un if else
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        //como js pasa argumentos por referencia entonces esta misma request 
        //se va a pasar a los demas middlewares y si pasa los middlewares
        //llega al controlador
        req.uid = uid;
        const user = await User.findById(uid);

        if (!user) return res.status(401).json({
            msg: 'token no valido - user dont exist'
        });

        if (!user.status) return res.status(401).json({
            msg: 'token no valido - user deleted'
        });

        req.authenticatedUser = user;

        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({ msg: 'token no válido' });
    }
}

module.exports = {
    validateJWT
};