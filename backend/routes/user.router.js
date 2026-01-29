const express = require('express');
const userController = require("../controllers/userController");
const userRouter = express.Router();

// Auth routes
userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);

// User routes
userRouter.get("/", userController.getAllUsers);           // GET /api/users
userRouter.get("/:id", userController.getUserProfile);     // GET /api/users/:id
userRouter.put("/:id", userController.updateUserProfile);  // PUT /api/users/:id
userRouter.delete("/:id", userController.deleteUserProfile); // DELETE /api/users/:id

module.exports = userRouter;
