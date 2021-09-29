const { request, response, json } = require('express');

const { Category } = require('../models');

const activeCategoriesFilter = { status: true };

const get = async (req = request, res = response) => {
    const { amount = 5, start = 0 } = req.query;

    const [totalCategories, categories] = await Promise.all([
        Category.countDocuments(activeCategoriesFilter),
        Category.find(activeCategoriesFilter)
            .populate('user', 'name')
            .skip(parseInt(start))
            .limit(parseInt(amount))
    ]);

    res.json({
        totalCategories,
        categories
    });
}

const getById = async (req = request, res = response) => {
    //este es el id que se manda en los parametros de segmento
    const { id } = req.params;
    const category = await Category.findById(id).populate('user', 'name');

    if (!category.status) return res.json({ msg: 'Categoria Eliminada' });

    res.json(category);
}

const post = async (req = request, res = response) => {
    const name = req.body.name.toUpperCase();
    const categoryDB = await Category.findOne({ name });

    if (categoryDB) return res.status(400).json({
        msg: `la categoria ${categoryDB.name} ya existe`
    });

    const data = {
        name,
        user: req.authenticatedUser._id
    };

    const category = new Category(data);
    await category.save();

    res.status(201).json(category);
}

const put = async (req = request, res = response) => {
    const { id } = req.params;
    const name = req.body.name.toUpperCase();

    const category = await Category.findById(id);
    if (!category.status) return res.json({ msg: 'La categoria fue eliminada' });

    const updatedCategory = await Category.findByIdAndUpdate(id, {
        name,
        user: req.authenticatedUser._id
    }, { new: true });

    res.json(updatedCategory);
}

const destroy = async (req = request, res = response) => {
    const { id } = req.params;

    //esto se puede optimizar ya que lo estoy usando en varias partes
    const category = await Category.findById(id);
    if (!category.status) return res.json({ msg: 'La categoria fue eliminada' });

    const deletedCategory = await Category.findByIdAndUpdate(id, { status: false });
    res.json(deletedCategory);
}

module.exports = {
    get,
    getById,
    post,
    put,
    destroy
};