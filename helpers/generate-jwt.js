const jwt = require('jsonwebtoken');

const generateJWT = (uid = '') => {
    return new Promise((resolve, rejected) => {
        const payload = { uid };

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                rejected('No se pudo generar el jwt');
            } else {
                resolve(token);
            }
        }
        );
    });
}

module.exports = {
    generateJWT
};