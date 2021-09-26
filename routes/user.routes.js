const { Router } = require('express');
const { check } = require('express-validator');

const UserController = require('../controllers/user.controller');
const { validRole, emailExist, userExistById } = require('../helpers/db-validators');
const { fieldsValidator } = require('../middlewares/fields-validator');

const router = Router();

router.get('/', UserController.get);

router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El correo no es válido').isEmail(),
    check('email').custom(emailExist),
    check('password', 'La contraseña es obligatoria y debe tener mas de 6 caracteres').isLength({ min: 6, max: 100 }),
    //check('role', 'No es un rol permitido').isIn(['USER_ROLE', 'ADMIN_ROLE']),
    check('role').custom(validRole),
    fieldsValidator
], UserController.post);

router.put('/:id', [
    //el check se da cuenta de eque tipo de parmetros son,
    //si los del body o los de segmento
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(userExistById),
    check('role').custom(validRole),
    fieldsValidator
], UserController.put);

router.patch('/', UserController.patch);
router.delete('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(userExistById),
    fieldsValidator
], UserController.destroy);

module.exports = router;