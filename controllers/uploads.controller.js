const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { request, response } = require('express');

const { uploadFile } = require('../helpers');
const { User, Product } = require('../models');

const uploadFiles = async (req = request, res = response) => {
    try {
        //const fileName = await uploadFile(req.files, ['txt', 'md'], 'texts');
        const fileName = await uploadFile(req.files, undefined, 'imgs');
        res.json({ fileName });
    } catch (msg) {
        res.status(400).json({ msg });
    }
}

const updateImage = async (req = request, res = response) => {
    const { collection, id } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) return res.status(400).json({
                msg: `El usuario con el id: ${id} no existe`
            });


            break;
        case 'products':
            model = await Product.findById(id);
            if (!model) return res.status(400).json({
                msg: `El Producto con el id: ${id} no existe`
            });

            break;
        default:
            res.status(500).json({
                msg: 'se le olvido validar esto jejej'
            });
            break;
    }

    //limpiar imagenes anteriores
    if (model.image) {
        const imagePath = path.join(__dirname, '../uploads', collection, model.image);
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    model.image = await uploadFile(req.files, undefined, collection);
    await model.save();

    res.json(model);
}

const updateImageCloudinary = async (req = request, res = response) => {
    const { collection, id } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) return res.status(400).json({
                msg: `El usuario con el id: ${id} no existe`
            });


            break;
        case 'products':
            model = await Product.findById(id);
            if (!model) return res.status(400).json({
                msg: `El Producto con el id: ${id} no existe`
            });

            break;
        default:
            res.status(500).json({
                msg: 'se le olvido validar esto jejej'
            });
            break;
    }

    if (model.image) {
        const urlSplied = model.image.split('/');
        const imageName = urlSplied[urlSplied.length - 1];
        const [public_id] = imageName.split('.');
        cloudinary.uploader.destroy(public_id);
    }

    const { tempFilePath } = req.files.file;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

    model.image = secure_url;
    await model.save();

    res.json({ url: model.image });
}

const showImage = async (req = request, res = response) => {
    const { collection, id } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) return res.status(400).json({
                msg: `El usuario con el id: ${id} no existe`
            });


            break;
        case 'products':
            model = await Product.findById(id);
            if (!model) return res.status(400).json({
                msg: `El Producto con el id: ${id} no existe`
            });

            break;
        default:
            res.status(500).json({
                msg: 'se le olvido validar esto jejej'
            });
            break;
    }

    //limpiar imagenes anteriores
    if (model.image) {
        const imagePath = path.join(__dirname, '../uploads', collection, model.image);
        if (fs.existsSync(imagePath)) {
            return res.sendFile(imagePath);
        }
    }

    const noImagePath = path.join(__dirname, '../assets/no-image.png');
    res.sendFile(noImagePath);
}

module.exports = {
    uploadFiles,
    updateImage,
    showImage,
    updateImageCloudinary
};