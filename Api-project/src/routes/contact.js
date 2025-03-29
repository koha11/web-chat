const contactController = require('../controllers/ContactController');
const { Router } = require('express');
const router = Router();
const auth = require('../config/auth');

router.get('/get-all', auth.verifyToken, contactController.getContactList);
router.get('/get-online', auth.verifyToken, contactController.getOnlineList);

module.exports = router;
