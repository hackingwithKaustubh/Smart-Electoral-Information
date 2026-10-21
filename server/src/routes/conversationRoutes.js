const express = require('express');
const { protect } = require('../middleware/auth');
const conversationController = require('../controllers/conversationController');

const router = express.Router();

router.use(protect);
router.get('/', conversationController.listConversations);
router.post('/', conversationController.createConversation);
router.get('/:id', conversationController.getConversation);
router.put('/:id', conversationController.updateConversation);
router.delete('/:id', conversationController.deleteConversation);
router.post('/:id/clear', conversationController.clearConversation);

module.exports = router;
