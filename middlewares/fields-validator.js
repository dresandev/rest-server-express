const { response, request } = require('express');
const { validationResult } = require('express-validator');

const fieldsValidator = (req = request, res = response, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).json(errors);
    //es para que siga ejecutando o bien  
    //el siguiente middleware o el controlador
    next();
}

module.exports = {
    fieldsValidator
};