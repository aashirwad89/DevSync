const express = require('express');

const mainRouter = express.Router();

mainRouter.get("/", (req, res)=>{
    res.send("Welcome to dev-sync backend");
   });

   module.exports = mainRouter;