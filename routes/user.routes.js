const { Router } = require('express');

const UserController = require('../controllers/user.controller')

const router = Router();

router.get('/', UserController.get);
router.post('/:id', UserController.post);
router.put('/', UserController.put);
router.patch('/', UserController.patch);
router.delete('/', UserController.destroy);

module.exports = router;