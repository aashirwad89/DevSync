const express = require('express');
const userController = require("../controllers/userController");
const userRoute = express.Router();

userRoute.get("/allusers", userController.getAllUsers);
userRoute.post("/signup", userController.signup);
userRoute.post("/login", userController.login);
userRoute.get("/userProfile", userController.getUserProfile);
userRoute.delete("/deleteProfile", userController.deleteUserProfile);
userRoute.put("/updateProfile", userController.updateUserProfile);


module.exports = userRoute;