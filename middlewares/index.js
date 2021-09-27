
const FieldsValidator = require('../middlewares/fields-validator');
const ValidateJWT     = require('../middlewares/validate-jwt');
const ValidateRoles   = require('../middlewares/validate-roles');

module.exports = {
    ...FieldsValidator,
    ...ValidateJWT,
    ...ValidateRoles
}