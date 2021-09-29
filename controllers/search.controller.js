const { request, response } = require('express');
const { ObjectId } = require('mongoose').Types;

const { User, Category, Product } = require('../models')

const allowedCollections = [
    'users',
    'categories',
    'products',
    'roles'
];

const searchUsers = async (term = '', res = response) => {
    const isMongoId = ObjectId.isValid(term);
    if (isMongoId) {
        const user = await User.findById(term);
        return res.json({ results: user ? [user] : [] });
    }

    const regExp = new RegExp(term, 'i');
    const users = await User.find({
        $or: [{ name: regExp }, { email: regExp }],
        $and: [{ status: true }]
    });

    return res.json({ results: users });
}

const searchCategories = async (term = '', res = response) => {
    const isMongoId = ObjectId.isValid(term);
    if (isMongoId) {
        const category = await Category.findById(term).populate('user', 'name');
        return res.json({ results: category ? [category] : [] });
    }

    const regExp = new RegExp(term, 'i');
    const categories = await Category.find({
        $and: [{ name: regExp }, { status: true }]
    }).populate('user', 'name');

    return res.json({ results: categories });
}

const searchProducts = async (term = '', res = response) => {
    const isMongoId = ObjectId.isValid(term);
    if (isMongoId) {
        const product = await Product.findById(term)
            .populate('user', 'name')
            .populate('category', 'name');

        return res.json({ results: product ? [product] : [] });
    }

    const regExp = new RegExp(term, 'i');
    const products = await Product.find({
        $and: [{ name: regExp }, { status: true }]
    })
        .populate('user', 'name')
        .populate('category', 'name');;

    return res.json({ results: products });
}

const search = async (req = request, res = response) => {
    const { collection, term } = req.params;

    if (!allowedCollections.includes(collection)) return res.status(400).json({
        msg: `Las colecciones permitidas son: ${allowedCollections}`
    })

    switch (collection) {
        case 'users':
            await searchUsers(term, res);
            break;
        case 'categories':
            await searchCategories(term, res);
            break;
        case 'products':
            await searchProducts(term, res);
            break;
        default: res.status(500).json({
            msg: 'se le olvido hacer esta busqueda'
        })
    }
}

module.exports = {
    search
};