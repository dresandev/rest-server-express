
const FieldsValidator = require('../middlewares/fields-validator');
const ValidateJWT     = require('../middlewares/validate-jwt');
const ValidateRoles   = require('../middlewares/validate-roles');
const ValidateFile    = require('./validate-file');

module.exports = {
    ...FieldsValidator,
    ...ValidateJWT,
    ...ValidateRoles,
    ...ValidateFile
}