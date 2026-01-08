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

const getAllrepositary = async (req, res) => {
  try {
    const repos = await Repository
      .find()
      .populate("owner")
      .populate("issues")
      .lean();

    res.status(200).json(repos);
  } catch (err) {
    console.log("Error in get all repo", err);
    res.status(500).json({ message: "Server error" });
  }
};


const fetchrepositaryById = async (req, res) => {
  const { id } = req.params;

  try {
    const repository = await Repository
      .findById(id)
      .populate("owner")
      .populate("issues")
      .lean();

    if (!repository) {
      return res.status(404).json({ message: "Repository not found" });
    }

    res.status(200).json(repository);
  } catch (err) {
    console.log("Error in fetching repo by id", err);
    res.status(500).json({ message: "Server error" });
  }
};

const fetchrepositaryByName = async (req, res) => {
  const { repoName } = req.params;

  try {
    const repository = await Repository
      .findOne({ name: repoName })
      .populate("owner")
      .populate("issues")
      .lean();

    if (!repository) {
      return res.status(404).json({ message: "Repository not found" });
    }

    res.status(200).json(repository);
  } catch (err) {
    console.log("Error in fetching repo by name", err);
    res.status(500).json({ message: "Server error" });
  }
};


const fetchrepositaryForCurrentUser = async (req, res)=>{
    const userId = req.user;
    try{
const repos = await Repository.find({owner:userId});
if(!repos || repos.length==0){
return res.status(404).json({error:"User Repo not found"})
}
res.json({message:"Repositaries found !", repos});
    }catch(err){
        console.log("Error in fetch repo for curr user" , err);
        res.status(500).json("server Error");
    }

}

const updaterepositaryById = async (req, res)=>{
    const {id} = req.params;
    const {content , description} = req.body;

    try{
const repositary = await Repository.findByIdAndUpdate(id);
if(!repositary){
    return res.status(404).json({error: "repo is nt found"})
}

repositary.content.push(content);
repositary.description = description;

const updatedRepo = await repositary.save();

re.json({
    message:"Repo  update successfully", 
    repositary:updatedRepo
})
    }catch(err){
        console.log("Error in update repo by Id ", err);
        res.status(500).json("Server error");
    }
}

const toggleVisiblityById = async (req, res)=>{
     const {id} = req.params;
    const {content , description} = req.body;

    try{
const repositary = await Repository.findById(id);
if(!repositary){
    return res.status(404).json({error: "repo is nt found"})
}

repositary.content.push(content);
repositary.description = description;

const updatedRepo = await repositary.save();

re.json({
    message:"Repo  update successfully", 
    repositary:updatedRepo
})
    }catch(err){
        console.log("Error in update repo by Id ", err);
        res.status(500).json("Server error");
    }
}

const deleterepositaryById = async (req, res)=>{
  const {id} = req.params;
  try{
const repositary = await Repository.findByIdAndDelete(id);
if(!repositary){
  return res.status(404).json({error: "Repositary not found"})
}

res.json({message: "Repositary Deleted"});

  }catch(err){
    console.log("Error in delete repo", err);
    res.status(500).json("Server Error");
  }
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






