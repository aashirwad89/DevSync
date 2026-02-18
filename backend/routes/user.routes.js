const express = require('express');
const userController = require('../controllers/userController')

const userRouter = express.Router();

userRouter.get("/allusers", userController.getAllUsers);
userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);
userRouter.get("/userProfile/:id", userController.getUserProfile);
userRouter.put("/updateProfile/:id", userController.updateUserProfile);
userRouter.delete("/deleteProfile/:id", userController.deleteProfile);


module.exports = userRouter; 

