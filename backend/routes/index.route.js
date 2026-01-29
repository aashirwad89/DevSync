const express = require('express');
const userRouter = require("./user.router");
const repoRouter = require("./repo.router");
const issueRouter = require("./issue.router");

const mainRouter = express.Router();

// API Versioning - Best Practice
mainRouter.use("/api/v1/users", userRouter);     // /api/v1/users/*
mainRouter.use("/api/v1/repos", repoRouter);     // /api/v1/repos/*
mainRouter.use("/api/v1/issues", issueRouter);   // /api/v1/issues/*

mainRouter.get("/", (req, res) => {
    res.json({ 
        message: "GitHub Clone API v1.0", 
        endpoints: {
            users: "/api/v1/users",
            repos: "/api/v1/repos", 
            issues: "/api/v1/issues"
        }
    });
});

module.exports = mainRouter;
