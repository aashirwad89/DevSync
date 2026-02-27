const express = require('express');
const userRouter = require('./user.routes');
const repoRouter = require('./repo.routes');
const issueRouter = require('./issue.routes');
const chatRouter = require('./chat.routes');  // ✅ Import chat router

const mainRouter = express.Router();

// ============= ROUTE MOUNTING =============

// Mount all routers
mainRouter.use(userRouter);
mainRouter.use(repoRouter);
mainRouter.use(issueRouter);
mainRouter.use(chatRouter);  // ✅ Mount chat routes

// Welcome endpoint
mainRouter.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the backend of DevSync',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      chat: {
        sendMessage: 'POST /chat',
        history: 'GET /chat/history',
        clear: 'POST /chat/clear',
        health: 'GET /chat/health'
      },
      users: 'POST /user, GET /user, etc.',
      repos: 'POST /repo, GET /repo, etc.',
      issues: 'POST /issue, GET /issue, etc.'
    }
  });
});

module.exports = mainRouter;