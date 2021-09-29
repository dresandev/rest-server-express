const bcryptjs = require('bcryptjs');
const { response, request } = require('express');

const User = require('../models/user');

const get = async (req = request, res = response) => {
    const { amount = 5, start = 0 } = req.query;
    //esta validacion de que deben ser solo numero solo la agregue por hacer la prueba pero
    //realmente no es necesario, con los valores por defecto es suficiente, o asi lo he visto
    //en varias APIS
    if (!isNaN(amount) && !isNaN(start)) {
        const activeUsersFilter = { status: true };
        /**
         * DE ESTA MANERA EL CODIGO FUNCIONA PERO ES MENOS OPTIMO HACERLO ASI, POR EL TIEMPO
         * DE RESPUESTA, LO MEJOR ES USAR LA FUNCION Promise.all([]) EN DONDE SE ENVIA UN 
         * ARREGLO DE PROMESAS QUE SE RESOLVERAN AL MISMO TIEMPO Y RETORNARA EN UN ARREGLO SUS RESPUESTAS 
         * EN MI CASO LA BASE DE DATOS REMOTA ESTA BASTANTE LEJOS LA ULTIMA PETICION QUE REALICE SIN USAR
         * EL Promise.all([]) FUE DE 250 MS APROX Y DE ESO BAJO A 119 MS APROX
         *  const totalDocuments = await User.countDocuments(activeUsersFilter);
         *  const users = await User.find(activeUsersFilter)
         *                          .skip(parseInt(start))
         *                          .limit(parseInt(amount));
         *  
         */
        const [totalDocuments, users] = await Promise.all([
            User.countDocuments(activeUsersFilter),
            User.find(activeUsersFilter)
                .skip(parseInt(start))
                .limit(parseInt(amount))
        ]);

        res.json({
            totalDocuments,
            users
        });
    } else {
        return res.status(400).json({
            msg: "los query parameters deben ser numeros enteros"
        });
    }
}

const post = async (req = request, res = response) => {
    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });

    //encriptar contraseña
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);
    //guardar en db el nuevo usuario
    await user.save();

    res.json(user);
}

const put = async (req = request, res = response) => {
    const { id } = req.params;
    const { _id, password, google, email, ...resto } = req.body;

    //TODO: Validar contra bd
    if (password) {
        const salt = bcryptjs.genSaltSync();
        //aqui lo que estoy haciendo es agregarlo
        //la propiedad password no esta en resto
        //ya que anteriormente desestructuramos
        //y sacamos esa propiedad de ahi
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, resto);

    res.json(user);
}

const patch = async (req, res = response) => {
    res.json();
}

const destroy = async (req = request, res = response) => {
    const { id } = req.params;
    //eliminacion para no perder la integridad referencial
    const deletedUser = await User.findByIdAndUpdate(id, { status: false });

    res.json(deletedUser);
}

module.exports = {
    get,
    post,
    put,
    patch,
    destroy
};