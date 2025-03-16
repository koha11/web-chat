const { Router } = require('express');
const messageController = require('../controllers/MessageController');

const router = Router();
const auth = require('../config/auth');

// GET
router.get('/', auth.verifyToken, messageController.index);
router.get('/get-chatlist', auth.verifyToken, messageController.getChatlist);
router.get(
  '/get-messages/:id',
  auth.verifyToken,
  messageController.getMessages
);

router.get('/:id', auth.verifyToken, messageController.chatDetails);

// POST
router.post('/create-chat', auth.verifyToken, messageController.createChat);

router.post(
  '/send-message/:id',
  auth.verifyToken,
  messageController.sendMessage
);

module.exports = router;
