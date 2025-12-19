const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
const ObjectId = require("mongodb").ObjectId;

dotenv.config();

const uri = process.env.MONGODB_URI;

let client;

// 🔗 MongoDB connection (singleton)
async function connectClient() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    console.log("MongoDB connected 🚀");
  }
  return client;
}

// 📝 SIGNUP
const signup = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const client = await connectClient();
    const db = client.db("devsync");
    const userCollection = db.collection("users");

    const user = await userCollection.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      username,
      email,
      password: hashedPassword,
      repositories: [],
      followedUsers: [],
      starredRepos: [],
      createdAt: new Date()
    };

    const result = await userCollection.insertOne(newUser);

    const token = jwt.sign(
      { id: result.insertedId },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "24h" }
    );

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔐 LOGIN (placeholder)
const login = async (req, res) => {
  const {email , password} = req.body;
  try{
    await connectClient();

    const db = client.db("devsync");
    const userCollection = db.collection("users")

    const user = await userCollection.findOne({email});
    if(!user){
      return res.status(400).json({message: "User not found"})
    }

    const isMatch = await bcrypt.compare(password , user.password)
    if(!isMatch){
      return res.status(400).json({message: "Invalid crediantials"})
    }

    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET_KEY, {expiresIn:"1h"})
    res.json({token, userId:user._id});
  }catch(e){
    console.log("login error", e);
    res.status(500).send("server error");
  }
};

// 👥 USERS
const getAllUsers = async (req, res) => {
  try{
await connectClient();
const db = client.db("devsync");
const userCollection = db.collection("users");

const users = await userCollection.find({}).toArray();
res.json(users);


  }catch(err){
console.log("error in get all users", err)
res.status(500).send("Server error in userControllers")
  }
};

const getUserProfile = async (req, res) => {
  const currId = req.params.id;

  try{
await connectClient();
const db = client.db("devsync");
const userCollection = db.collection("users");

const user = await userCollection.findOne({
  _id: new ObjectId(currId)
});

if(!user){
  return res.status(400).json({message:"Not found the user profile"})
}
  }catch(e){
    console.log("error in get user profile", e);
    res.status(500).send("server error")
  }
  res.send("User profile");
};

const updateUserProfile = async (req, res) => {
  res.send("Profile updated");
};

const deleteUserProfile = async (req, res) => {
  res.send("Profile deleted");
};

module.exports = {
  signup,
  login,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile
};
