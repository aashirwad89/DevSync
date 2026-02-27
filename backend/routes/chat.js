const express = require('express')
const router = express.Router()
const chatController = require('../controllers/chatController')

// POST /api/chat - Send message
router.post('/', chatController.sendMessage)

// GET /api/chat/history - Get chat history
router.get('/history', chatController.getChatHistory)

// POST /api/chat/clear - Clear chat
router.post('/clear', chatController.clearChat)

// GET /api/chat/:id - Get specific message
router.get('/:id', chatController.getMessageById)

module.exports = router