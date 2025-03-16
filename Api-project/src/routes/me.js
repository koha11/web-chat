const { Router } = require('express');

const router = Router();

const accountController = require('../controllers/AccountController');

router.get('/', accountController.index);

module.exports = router;
