const { request, response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');
const { generateJWT } = require('../helpers/generate-jwt');
const { googleVerify } = require('../helpers/google-verify');

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

        res.json({ user, token });

    } catch (err) {

        console.log(err);
        return res.status(500).json({
            msg: 'algo salio mal, comuniquese con el ADMIN'
        });
    }
}

const googleSignin = async (req = request, res = response) => {
    const { id_token } = req.body;

    try {
        const { email, name, image } = await googleVerify(id_token);
        let user = await User.findOne({ email });

        if (!user) {
            const data = {
                name,
                email,
                password: ':p',
                image,
                google: true
            };

            user = new User(data);
            await user.save();
        }

        if (!user.status) return res.status(401).json({
            msg: 'contact with admin user blocked'
        })

        const token = await generateJWT(user.id);

        res.json({
            user,
            token
        });
    } catch (err) {
        res.status(400).json({
            msg: 'token de google no válido'
        });
    }
}

module.exports = {
    login,
    googleSignin
};