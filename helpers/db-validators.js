const Role = require('../models/role');
const User = require('../models/user');

const validRole = async (role = '') => {
    const roleExist = await Role.findOne({ role });
    if (!roleExist) throw new Error(`El rol ${role} no está registardo en la base de datos`);
}

const emailExist = async (email = '') => {
    const emailExist = await User.findOne({ email });
    if (emailExist) throw new Error('El correo ya está registrado');
}

const userExistById = async (id) => {
    const userExist = await User.findById(id);
    if (!userExist) throw new Error('El usuario no existe');
}

module.exports = {
    validRole,
    emailExist,
    userExistById
}