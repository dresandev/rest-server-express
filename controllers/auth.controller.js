const { request, response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');
const { generateJWT } = require('../helpers/generate-jwt');

const login = async (req = request, res = response) => {
    const { email, password } = req.body;

    try {
        //verificar si el email existe
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'usuario/contraseña incorrectos - correo' });

        //verificar si el usuario está activo
        if (!user.status) return res.status(400).json({ msg: 'usuario deshabilitado' });

        //verificar contraseña
        const validaPassword = bcryptjs.compareSync(password, user.password);
        if (!validaPassword) return res.status(400).json({ msg: 'usuario/contraseña incorrectos - contraseña' });

        //generar jwt
        const token = await generateJWT(user.id);

        res.json({
            user,
            token
        });

    } catch (err) {

        console.log(err);
        return res.status(500).json({
            msg: 'algo salio mal, comuniquese con el ADMIN'
        });
    }
}

module.exports = {
    login
};