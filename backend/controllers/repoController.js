const mongoose = require('mongoose');
const Repository = require('../models/repoModel')
const User =    require('../models/userModel');
const Issue = require('../models/issueModel');

const createRepo = async (req, res)=>{
    const { owner , name , issues , content , description , visiblity} = req.body;
    try{
if(!name){
    return res.status(400).json({message : "Repositary name is required"})
}
if(!mongoose.Types.ObjectId.isValid(owner)){
return res.status(400).json({message: "Invalid User ID"})
}
const newRepo = new Repository({
    name, 
    description,
     visiblity, 
     owner, 
     content,
    issues
})
const result = await newRepo.save();
res.status(201).json({
    message:"Repositary created!", 
    repositaryId:result._id,
})
    }catch(err){
        console.log("Create repo error", err);
        res.status(500).send("Server error");
    }
}

const getAllrepositary = async (req, res)=>{
    try{
const repos = await Repository.find({}).populate("owner").populate("issues");
res.json(repos);
    }catch(err){
        console.log("Error in get all repo", err);
        res.status(500).send("Server error")
    }
}

const fetchrepositaryById = async (req, res)=>{
    const repoID = req.params.id;
    try{
const repositary = Repository.find({_id:repoID}).populate("owner").populate("issues").toArray();
res.json(repositary);
    }catch(err){
        console.log("Error in fetching repo by id", err);
        res.status(500).send("Server error");
    }
}

const fetchrepositaryByName = async (req, res)=>{
   const {repoName} = req.params.name;
    try{
const repositary = Repository.find({name:repoName}).populate("owner").populate("issues")
res.json(repositary);
    }catch(err){
        console.log("Error in fetching repo by id", err);
        res.status(500).send("Server error");
    }
}

const fetchrepositaryForCurrentUser = async (req, res)=>{
    res.send("All repo fetched for current user");
}

const updaterepositaryById = async (req, res)=>{
    res.send("All repo update by Id");
}

const toggleVisiblityById = async (req, res)=>{
    res.send("Toggle visible by ID");
}

const deleterepositaryById = async (req, res)=>{
    res.send("All repo got deleted by ID");
}

module.exports = {
    createRepo,
    getAllrepositary,
    fetchrepositaryById,
    fetchrepositaryByName,
    fetchrepositaryForCurrentUser,
    updaterepositaryById,
    toggleVisiblityById,
    deleterepositaryById
}






