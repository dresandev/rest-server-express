const { Schema, model } = require('mongoose');

const ProductSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    status: {
        type: Boolean,
        default: true,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    price: {
        type: Number,
        default: 0,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    description: {
        type: String,
        default: 'No-Description'
    },
    available: {
        type: Boolean,
        default: true
    }
});


ProductSchema.methods.toJSON = function () {
    const { __v, status, ...product } = this.toObject();
    return product;
};

module.exports = model('Product', ProductSchema);