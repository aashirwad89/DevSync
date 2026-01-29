const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const Repository = require("../models/repoModel");

const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Username, email, and password are required" 
            });
        }

        // Check existing user
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: "User with this email or username already exists" 
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email: email.toLowerCase(),
            password: hashedPassword
        });

        await newUser.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        const safeUser = {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email
        };

        res.status(201).json({ 
            success: true, 
            message: "User created successfully",
            token, 
            user: safeUser 
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Email and password required" 
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        const safeUser = {
            id: user._id,
            username: user.username,
            email: user.email
        };

        res.json({ 
            success: true, 
            message: "Login successful",
            token, 
            user: safeUser 
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .populate('repositories', 'name')
            .sort({ createdAt: -1 });

        res.json({ 
            success: true, 
            count: users.length, 
            users 
        });
    } catch (err) {
        console.log("Error getting all users:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id)
            .select('-password')
            .populate('repositories', 'name description visibility')
            .populate('starredRepositories', 'name');

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        res.json({ 
            success: true, 
            user 
        });
    } catch (err) {
        console.log("Error getting user profile:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password } = req.body;

        const user = await User.findById(id).select('+password');
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        let updateFields = {};
        if (username) updateFields.username = username;
        if (email) updateFields.email = email.toLowerCase();

        if (password) {
            const salt = await bcrypt.genSalt(12);
            updateFields.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(
            id, 
            { $set: updateFields }, 
            { new: true, runValidators: true }
        ).select('-password');

        res.json({ 
            success: true, 
            message: "Profile updated successfully", 
            user: updatedUser 
        });
    } catch (err) {
        console.log("Error updating profile:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const deleteUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        // Delete user's repositories
        await Repository.deleteMany({ owner: id });

        res.json({ 
            success: true, 
            message: "User profile deleted successfully" 
        });
    } catch (err) {
        console.log("Error deleting profile:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = {
    signup,
    login,
    getAllUsers,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile
};
