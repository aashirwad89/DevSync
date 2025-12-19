const express = require('express');
const userController = require("../controllers/userController");
const userRoute = express.Router();

userRoute.get("/allUsers", userController.getAllUsers);
userRoute.post("/signup", userController.signup);
userRoute.post("/login", userController.login);
userRoute.get("/userProfile/:id", userController.getUserProfile);
userRoute.delete("/deleteProfile/:id", userController.deleteUserProfile);
userRoute.put("/updateProfile/:id", userController.updateUserProfile);


module.exports = userRoute;