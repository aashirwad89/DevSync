const express = require('express');
const chatRouter = express.Router();
const chatController = require('../controllers/chat.controller-gemini');

// ============= CHAT ROUTES =============

// POST /chat - Send message to AI
chatRouter.post('/chat', chatController.sendMessage);

// GET /chat/history - Get chat history
chatRouter.get('/chat/history', chatController.getChatHistory);

// POST /chat/clear - Clear chat history
chatRouter.post('/chat/clear', chatController.clearChat);

// GET /chat/health - Health check
chatRouter.get('/chat/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    service: 'chat',
    timestamp: new Date().toISOString()
  });
});

module.exports = chatRouter;