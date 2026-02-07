const express = require('express');
const userController = require("../controllers/userController");
const userRouter = express.Router();
const auth = require('../middlewares/authMiddleware').auth; 

// Auth routes
userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);

// IMPORTANT: /me route MUST come BEFORE /:id route
// Otherwise Express will treat "me" as an ID parameter
userRouter.get('/me', auth, async (req, res) => {
  try {
    // req.user is set by auth middleware
    res.json({ 
      success: true, 
      data: req.user 
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: error.message
    });
  }
});

// Profile update route - also should come before /:id
userRouter.patch('/update-profile', auth, async (req, res) => {
  try {
    const { avatar, bio } = req.body;
    const userId = req.user._id;

    // Update user in database
    const User = require('../models/user.model');
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        $set: { 
          avatar: avatar || req.user.avatar,
          bio: bio || req.user.bio
        } 
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
});

// User routes - these come AFTER specific routes like /me
userRouter.get("/", userController.getAllUsers);           // GET /api/users
userRouter.get("/:id", userController.getUserProfile);     // GET /api/users/:id
userRouter.put("/:id", userController.updateUserProfile);  // PUT /api/users/:id
userRouter.delete("/:id", userController.deleteUserProfile); // DELETE /api/users/:id

module.exports = userRouter;