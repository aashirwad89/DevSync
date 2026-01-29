const express = require('express');
const repoController = require("../controllers/repoController");
const repoRouter = express.Router();
const GitController = require("../controllers/gitController");
// Git Operations - Complete GitHub Flow
repoRouter.get('/:repoId/commits', auth, GitController.listCommits);
repoRouter.post('/:repoId/push', auth, GitController.pushRepo);
repoRouter.post('/:repoId/pull', auth, GitController.pullRepo);
repoRouter.post('/:repoId/revert/:commitID', auth, GitController.revertRepo);
repoRouter.get('/:repoId/history', auth, GitController.getCommitHistory);
repoRouter.get('/:repoId/status', auth, GitController.getStatus);

module.exports = repoRouter;
