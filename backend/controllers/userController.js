const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {MongoClient, ReturnDocument} = require('mongodb');
var Objectid =  require("mongodb").ObjectId;

const dotenv = require('dotenv');
dotenv.config();

const URI = process.env.MONGODB_URI;
let client;

async function connectClient() {
    if(!client){
        client = new MongoClient(URI);
        await client.connect();
    }
}

const getAllUsers =async (req, res)=>{
  try{
    await connectClient();
const db = client.db("devgit");
const userCollection = db.collection("users");

const users = await userCollection.find({}).toArray();
res.json(users);

  }catch(err){
    console.log("Error in getting all users", err)
    res.status(500).json({message: "Server error"})
  }
}

const signup = async (req, res)=>{
    const {username , password , email} = req.body;
    try{
await connectClient();
const db = client.db("devgit")
const userCollection = db.collection("users");


const user = await userCollection.findOne({username});
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

const token = jwt.sign({id:result.insertedId}, process.env.SECRET_KEY, {expiresIn:"1hr"})

res.json({token});
    }catch(err){
        console.log("Unable to sign up Please check backend is running", err)
        res.status(500).send("Server error")
    }
}

const login = async (req, res)=>{
   const {email , password} = req.body;
   try{
await connectClient();

const db = client.db("devgit");
const userCollection = db.collection("users");

const user = await userCollection.findOne({email});
if(!user){
    return res.status(400).json({message: "User not found"})
}

const isMatch = await bcrypt.compare(password, user.password);
if(!isMatch){
    return res.status(400).json({message: "Invalid password"})
}

const token = jwt.sign({id:user._id}, process.env.SECRET_KEY, {expiresIn:"1h"});
res.json({token , userId:user._id});

   }catch(err){
    console.log(err, "Error while login");
    res.status(500).json("Server error in login");
   }
}

const getUserProfile = async (req, res)=>{
 const currId = req.params.id;
 try{
await connectClient();
const db = client.db("devgit")
const userCollection = db.collection("users");

const user = await userCollection.findOne({
    _id: new Objectid(currId),
})
if(!user){
    return res.status(400).json({message: "Unable to fetch profile page"});
}

 res.send(user, "Profile fetched successfully");
 }  catch(err){
    console.log(err, "Error in getting profile of user");
    res.status(500).json({message: "Server error in getting user profile"})
 }


}

const updateUserProfile = async (req, res)=>{
    const currId = req.params.id;
    const {email , password} = req.body;
    try{

        await connectClient();
        const db = client.db("devgit");
        const userCollection = db.collection("users")

let updatedFields = {email};

if(password){
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    updatedFields.password = hashedPassword;
}

const result = await userCollection.findOneAndUpdate({
    _id: new Objectid(currId),
}, {$set: updatedFields},
{returnDocument: "after"});

if(!result){
    return res.status(404).json({message: "User not found"})
}
res.send(result.value);
    }catch(err){
        console.log("Error in updating profile", err)
        res.status(500).json("Server error");
    }
}

const deleteProfile = async (req , res)=>{
  const currId = req.params.id;
  try{
    await connectClient();
    const db = client.db("devgit");
    const userCollection = db.collection("users");

    const result =  await userCollection.deleteOne({
        _id: new Objectid(currId),
    })

    if(result.deleteCount == 0){
        return res.status(404).json({message: "User not found"})
    }

    res.json({message: "User Profile deleted"})

  }catch(err){
    console.log(err, "unable to delete profile");
    res.status(500).json("server error in deleting profile")
  }
}

module.exports = {
    getAllUsers,
    signup,
    login,
    getUserProfile,
    updateUserProfile,
    deleteProfile
}

