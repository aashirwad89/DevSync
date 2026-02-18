const mongoose = require("mongoose");
const Repositary = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");


const createRepositary = async (req, res)=>{
    const {owner, name, issues, content, description , visiblity} = req.body;
    
try{

    if(!name){
        return  res.status(400).json({message: "Repositary name is required"})
    }

    if(!mongoose.Types.ObjectId.isValid(owner)){
return res.status(400).json({error: "Invalid UserID please try again"});
    }

    const newRepositary = new Repositary({
        name, description, visiblity, owner, content , issues
    })
const result = await newRepositary.save();

res.status(201).json({
    message: "Repositary created", repositaryId: result._id, 

})

    }catch(err){
        console.log("Error while creating repo", err)
        res.status(500).send("Server Error");
    }
}

const getAllRepositaries = async (req, res)=>{
    res.send("all repos fetched !")
}

const fetchRepositaryById = async (req, res)=>{
    res.send("fetch repos by ID done !")
}

const fetchRepositaryByName = async (req, res)=>{
    res.send("fetch repos by name done")
}

const fetchRepositaryForCurrentUser = async (req,res)=>{
    res.send("Fetch repo for current user done !")
}

const updateRepositaryById = async (req,res)=>{
    res.send("update repo by id done")
}

const toggleVisiblityById = async (req, res)=>{
    res.send("Toggle visiblity by ID done")
}

const deleteRepositaryById = async (req, res)=>{
    res.send("Repo is deleleted")
}

module.exports = {
    createRepositary,
    getAllRepositaries,
    fetchRepositaryById,
    fetchRepositaryByName,
    fetchRepositaryForCurrentUser,
    updateRepositaryById,
    toggleVisiblityById,
    deleteRepositaryById
}