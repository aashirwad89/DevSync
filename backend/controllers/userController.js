const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {MongoClient} = require('mongodb');

const dotenv = require('dotenv');
dotenv.config();

const URI = process.env.MONGODB_URI;
let client;

async function connectClient() {
    if(!client){
        client = new MongoClient(URI, {useNewUrlParser:true, useUnifiedTopology: true });
        await client.connect();
    }
}

const getAllUsers = (req, res)=>{
    res.send("All users fetched")
}

const signup = async (req, res)=>{
    const {username , password , email} = req.body;
    try{
await connectClient();
const db = client.db("devgit")
const userCollection = db.collection("users");


const user = await userCollection.fiindOne({username});
if(user){
    return res.status(400).json({message:"User already exists"})
}

const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

const newUser = {
    username,
    password:hashedPassword,
    email,
    repositaries : [],
    followedUsers : [],
    starredRepos : []
}

const result = await userCollection.insertOne(newUser);

const token = jwt.sign({id:result.insertId}, process.env.SECRET_KEY, {expiresIn:"1hr"})

res.json({token});
    }catch(err){
        console.log("Unable to sign up Please check backend is running", err)
        res.status(500).send("Server error")
    }
}

const login = (req, res)=>{
    res.send("Logginf in")
}

const getUserProfile = (req, res)=>{
    res.send("user profile fetched ")
}

const updateUserProfile = (req, res)=>{
    res.send("Update user profile done");
}

const deleteProfile = (req , res)=>{
    res.send("user profile deleted")
}

module.exports = {
    getAllUsers,
    signup,
    login,
    getUserProfile,
    updateUserProfile,
    deleteProfile
}

