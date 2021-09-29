const { request, response } = require('express');
const { categoryExistByName } = require('../helpers/db-validators');
const { Product, Category } = require('../models');

const activeProductsFilter = { status: true };

const get = async (req = request, res = response) => {
    const { amount = 5, start = 0 } = req.query;

    const [totalProducts, products] = await Promise.all([
        Product.countDocuments(activeProductsFilter),
        Product.find(activeProductsFilter)
            .populate('user', 'name')
            .populate('category', 'name')
            .skip(parseInt(start))
            .limit(parseInt(amount))
    ]);

    res.json({
        totalProducts,
        products
    });
}

const getById = async (req = request, res = response) => {
    const { id } = req.params;
    const product = await Product.findById(id)
        .populate('user', 'name')
        .populate('category', 'name');

    if (!product.status) return res.json({ msg: 'Producto Eliminado' });

    res.json(product);
}

const post = async (req = request, res = response) => {
    const { status, user, ...body } = req.body;
    const productDB = await Product.findOne({ name: body.name });

    if (productDB) return res.status(400).json({
        mgs: `El producto ${productDB.name} ya está registrado`
    });

    const data = {
        ...body,
        name: body.name.toUpperCase(),
        user: req.authenticatedUser._id,
    };

    const product = new Product(data);
    await product.save();

    res.status(201).json(product);
}

const put = async (req = request, res = response) => {
    const { id } = req.params;
    const { status, user, ...body } = req.body;

    if (body.name) body.name = body.name.toUpperCase();

    const product = await Product.findById(id);
    if (!product.status) return res.json({ msg: 'El Producto fue eliminado' });

    const data = {
        ...body,
        name: body.name,
        user: req.authenticatedUser._id,
    };
    const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true });

    res.json(updatedProduct);
}

const destroy = async (req = request, res = response) => {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product.status) return res.json({ msg: 'El Producto fue eliminado' });

    const deletedProduct = await Product.findByIdAndUpdate(id, { status: false });
    res.json(deletedProduct);
}

module.exports = {
    get,
    getById,
    post,
    put,
    destroy
};