const express = require('express');
const userRoute = require("./user.router");
const repoRouter = require("./repo.router");
const issueRouter = require("./issue.router")


const mainRouter = express.Router();

mainRouter.use(userRoute);
mainRouter.use(repoRouter);
mainRouter.use(issueRouter);

mainRouter.get("/", (req, res)=>{
    res.send("Welcome ! ")
})

   module.exports = mainRouter;