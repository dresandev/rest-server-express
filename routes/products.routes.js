const { Router } = require('express');
const { check } = require('express-validator');

const { fieldsValidator, validateJWT, isAdminRole } = require('../middlewares');
const ProductController = require('../controllers/products.controller');
const { productExistById, categoryExistById } = require('../helpers/db-validators');

const router = new Router();

router.get('/', ProductController.get);

router.get('/:id', [
    check('id', 'No es un id Válido').isMongoId(),
    check('id').custom(productExistById),
    fieldsValidator
], ProductController.getById);

router.post('/', [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('category', 'No es un Id Valido de mongo'),
    check('category').custom(categoryExistById),
    fieldsValidator
], ProductController.post);

router.put('/:id', [
    validateJWT,
    check('id', 'No es un id Válido').isMongoId(),
    check('id').custom(productExistById),
    fieldsValidator
], ProductController.put);

router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'No es un id Válido').isMongoId(),
    check('id').custom(productExistById),
    fieldsValidator
], ProductController.destroy);

module.exports = router;