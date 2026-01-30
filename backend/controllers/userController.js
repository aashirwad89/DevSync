const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

// ✅ FIXED: Frontend "name" → Backend "username"
const signup = async (req, res) => {
  try {
    console.log('📥 RAW BODY:', req.body); // DEBUG
    
    const { name, email, password } = req.body; // Frontend se name aayega
    
    // Frontend name → Backend username mapping
    const username = name;
    
    if (!username || !email || !password) {
      console.log('❌ MISSING:', { username, email, password });
      return res.status(400).json({ 
        success: false, 
        message: "Username, email, and password are required" 
      });
    }

    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: "User with this email or username already exists" 
      });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,  // ← name ko username banaya
      email: email.toLowerCase(),
      password: hashedPassword
    });

    await newUser.save();
    console.log('✅ User created:', newUser.username);

    const token = jwt.sign(
      { id: newUser._id },  // Backend consistent id field
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const safeUser = {
      _id: newUser._id,  // Frontend _id expect karta hai
      username: newUser.username,
      email: newUser.email
    };

    // ✅ Backend response structure frontend ke liye
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

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !await bcrypt.compare(password, user.password)) {
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
      _id: user._id,
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

module.exports = {
  signup,
  login,
  getAllUsers: async (req, res) => { /* existing code */ },
  getUserProfile: async (req, res) => { /* existing code */ },
  updateUserProfile: async (req, res) => { /* existing code */ },
  deleteUserProfile: async (req, res) => { /* existing code */ }
};
