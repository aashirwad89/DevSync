const express = require('express');
const issueController = require("../controllers/issueController");
const issueRouter = express.Router();

// Issue routes
issueRouter.post("/", issueController.createIssue);              // POST /api/issues
issueRouter.get("/", issueController.getAllIssues);              // GET /api/issues
issueRouter.get("/:id", issueController.getIssueById);           // GET /api/issues/:id
issueRouter.put("/:id", issueController.updateIssueById);        // PUT /api/issues/:id
issueRouter.delete("/:id", issueController.deleteIssueById);     // DELETE /api/issues/:id

module.exports = issueRouter;
