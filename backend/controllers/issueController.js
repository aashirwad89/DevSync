const mongoose = require('mongoose');
const Repositary = require("../models/repoModel")
const User = require("../models/userModel");
const Issues = require("../models/issueModel")

const createIssue = async(req , res)=>{
    const {title , description} = req.body;

    const{id} = req.params;

    try{
    const issue = new Issues({
            title,
            description,
            repositary: id,

    });

    await issues.save();

    res.status(201).json(issue);

}catch(err){
    console.log("Error in creating issues", err);
    res.status(500).json({message: "Server error"})
}
}

const updateIssueById = async (req, res)=>{
    const {id} = req.params;
    const {title,description , status} = req.body
    try{
const issue = await Issues.findbyId(id)

if(!issue){
    return res.status(404).json({error: "Issue not found"})
}

issue.title = title;
issue.description = description;
issue.status  = status;

await issue.save();

res.json(issue);
    }catch(err){
        console.log("Error in updating issue", err)
        res.status(500).json({message: "Server error"})
    }
}

const deleteIssueById = async (req, res)=>{
    const {id} = req.params;
    try{

const issue = await Isues.findByIdAndDelete(id);

if(!issue){
    return res.status(404).json({message: "Issue not found"})
}

res.json({message : "Issue deleted"})


    }catch(err){
        console.log(err, "error in deleting issue by id")
        res.status(500).json({message:"Server Error"})
    }
}

const getAllIssues = async (req, res)=>{
    res.send("get all issues done")
}

const getIssuebyId = async (req, res)=>{
    res.send("get issue by ID done")
}

module.exports = {
    createIssue,
    updateIssueById,
    deleteIssueById,
    getAllIssues,
    getIssuebyId
}