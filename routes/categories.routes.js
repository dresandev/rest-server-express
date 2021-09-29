const { Router, response } = require('express');
const { check } = require('express-validator');

const { fieldsValidator, validateJWT, isAdminRole } = require('../middlewares');
const CategoriesController = require('../controllers/categories.controller');
const { categoryExistById } = require('../helpers/db-validators');

const router = new Router();

router.get('/', CategoriesController.get);

router.get('/:id', [
    check('id', 'No es un id Válido').isMongoId(),
    check('id').custom(categoryExistById),
    fieldsValidator
], CategoriesController.getById);

router.post('/', [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    fieldsValidator
], CategoriesController.post);

router.put('/:id', [
    validateJWT,
    check('id', 'No es un id Válido').isMongoId(),
    check('id').custom(categoryExistById),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    fieldsValidator
], CategoriesController.put);

router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'No es un id Válido').isMongoId(),
    check('id').custom(categoryExistById),
    fieldsValidator
], CategoriesController.destroy);

module.exports = router;