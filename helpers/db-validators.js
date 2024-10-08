const { Category, User, Role, Product } = require('../models');

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

const categoryExistById = async (id) => {
    const categoryExist = await Category.findById(id);
    if (!categoryExist) throw new Error('La categoría no existe');
}

const productExistById = async (id) => {
    const productExist = await Product.findById(id);
    if (!productExist) throw new Error('El Producto no existe');
}

const collectionValidate = (collection = '', validCollections = []) => {
    if (!validCollections.includes(collection)) {
        throw new Error(`La colección ${collection} no es permitida - ${validCollections}`);
    }
    //recordar retornar true en caso de que esta validacion la ejecutemos
    //con una funcion que retorna esta funcion 
    return true;
}

module.exports = {
    validRole,
    emailExist,
    userExistById,
    categoryExistById,
    productExistById,
    collectionValidate
}