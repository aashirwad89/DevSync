const express = require('express');
const userRoute = require("./user.router");


const mainRouter = express.Router();

mainRouter.use(userRoute);

mainRouter.get("/", (req, res)=>{
    res.send("Welcome ! ")
})

   module.exports = mainRouter;