const { Router } = require('express');
const { check } = require('express-validator');

const { fieldsValidator } = require('../middlewares/fields-validator');
const LoginController = require('../controllers/auth.controller');

const router = Router();

router.post('/login', [
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'la contraseña es obligatoria').not().isEmpty(),
    fieldsValidator
], LoginController.login);

module.exports = router;
