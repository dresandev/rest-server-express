const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const isAdminRole = async (req = request, res = response, next) => {
    if (!req.authenticatedUser) return res.status(500).json({
        msg: 'se intentó validar el rol sin validar el token primero'
    })

    const { role, name } = req.authenticatedUser;
    if (role !== 'ADMIN_ROLE') return res.status(401).json({
        msg: `El usuario ${name} no tiene permiso de ejecutar esta petición `
    });

    next();
}

const isRole = (...roles) => {
    return (req = request, res = response, next) => {
        if (!req.authenticatedUser) return res.status(500).json({
            msg: 'se intentó validar el rol sin validar el token primero'
        })

        if (!roles.includes(req.authenticatedUser.role)) return res.status(401).json({
            msg: `Para realizar esta peticion debes ser uno de estos roles ${roles} `
        });

        next();
    }
}

module.exports = {
    isAdminRole,
    isRole
};