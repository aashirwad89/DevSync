const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {MongoClient} = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();

const uri = process.env.MONGODB_URI;

let client;

async function connectClient(){
    if(!client){
        client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology:true})
        await client.connect();
    }
}

const signup = async (req, res) => {
  const { username, password, email } = req.body;

  try {
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

    //  insertedId 
    const token = jwt.sign(
      { id: result.insertedId },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "24h" }
    );

    res.status(201).json({ token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};


const login = (req, res)=>{
    res.send("login in");
}

const getAllUsers = (req, res)=>{
    res.send("All users fetched")
}


const getUserProfile = (req, res)=>{
    res.send("all users fetched");
}

const updateUserProfile = (req, res)=>{
    res.send("Profile updated")
}

const  deleteUserProfile = (req, res)=>{
    res.send("Profile deleted")
}


module.exports = {
    getAllUsers,
   signup,
    login,
   getUserProfile,
   updateUserProfile,
     deleteUserProfile
}