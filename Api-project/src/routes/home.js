const homeController = require('../controllers/HomeController');
const { Router } = require('express');
const router = Router();

router.get('/', homeController.index);
router.get('/login', homeController.login);
router.get('/register', homeController.register);
router.get('/error', homeController.index);
router.get('/logout', homeController.logout);

router.post('/signup', homeController.signup);
router.post('/signin', homeController.signin);

module.exports = router;
