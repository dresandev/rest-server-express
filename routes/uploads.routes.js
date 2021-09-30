const { Router } = require('express');
const { check } = require('express-validator');

const { collectionValidate } = require('../helpers');
const { fieldsValidator, validateFile } = require('../middlewares');
const UploadsController = require('../controllers/uploads.controller');

const router = Router();

router.post('/', validateFile, UploadsController.uploadFiles);

router.put('/:collection/:id', [
    validateFile,
    check('id', 'No es un id Válido').isMongoId(),
    check('collection').custom(c => collectionValidate(c, ['users', 'products'])),
    fieldsValidator
], UploadsController.updateImageCloudinary);

router.get('/:collection/:id', [
    check('id', 'No es un id Válido').isMongoId(),
    check('collection').custom(c => collectionValidate(c, ['users', 'products'])),
    fieldsValidator
], UploadsController.showImage)

module.exports = router;
