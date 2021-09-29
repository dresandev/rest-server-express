const { Router } = require('express');

const SearchController = require('../controllers/search.controller');

const router = new Router();

router.get('/:collection/:term', SearchController.search);

module.exports = router;    