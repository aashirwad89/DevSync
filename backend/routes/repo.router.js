const express = require('express');
const repoController = require("../controllers/repoController");
const repoRouter = express.Router();
const GitController = require("../controllers/gitController");
const { auth } = require('../middlewares/authMiddleware');

// CRUD Routes for Repositories
repoRouter.get('/', repoController.getAllRepos);            // GET /api/v1/repos
repoRouter.post('/', auth, repoController.createRepo);      // POST /api/v1/repos
repoRouter.get('/user/:userId?', auth, repoController.getUserRepos); // GET /api/v1/repos/user or /api/v1/repos/user/:userId
repoRouter.get('/:id', repoController.getRepoById);         // GET /api/v1/repos/:id
repoRouter.put('/:id', auth, repoController.updateRepo);    // PUT /api/v1/repos/:id
repoRouter.delete('/:id', auth, repoController.deleteRepo); // DELETE /api/v1/repos/:id

// Collaborator Management
repoRouter.post('/:id/collaborators', auth, repoController.addCollaborator);    // POST /api/v1/repos/:id/collaborators
repoRouter.delete('/:id/collaborators', auth, repoController.removeCollaborator); // DELETE /api/v1/repos/:id/collaborators

// Git Operations - Complete GitHub Flow
repoRouter.get('/:repoId/commits', auth, GitController.listCommits);
repoRouter.post('/:repoId/push', auth, GitController.pushRepo);
repoRouter.post('/:repoId/pull', auth, GitController.pullRepo);
repoRouter.post('/:repoId/revert/:commitID', auth, GitController.revertRepo);
repoRouter.get('/:repoId/history', auth, GitController.getCommitHistory);
repoRouter.get('/:repoId/status', auth, GitController.getStatus);

module.exports = repoRouter;