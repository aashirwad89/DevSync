const mongoose = require("mongoose");
const Repositary  = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");

const createIssue = async (req, res)=>{
  const {title , description} = req.body;
  const {id } = req.params;

  try{
const issue = new Issue({
    title,
    description,
    repositary: id,
  })

  await issue.save();

  res.status(201).json(issue);
  }catch(err){
console.log("error in creating issue", err);
res.status(500).json("Server Error");
  }
}

const updateIssueById = async (req, res)=>{
   const {id} = req.params;
   const {title , description , status} = req.body;

   try{
const issue  = await Issue.findByIdAndUpdate(id);

if(!issue){
    return res.status(404).json({error:"Issue not found"})
}

issue.title = title;
issue.description = description;
issue.status = status;

await issue.save();
res.json({message: "Issue updated"});
   }catch(err){
    console.log("Error in update Issue by id", err);
    res.status(500).json("Server error");
   }
}

const deleteIssueById = async (req, res)=>{
   const {id} = req.params;
   try{
const issue = Issue.findByIdAndDelete(id);

if(!issue){
    return res.status(404).json({error: "Issue not found"})
}
res.json({message:"Issue deleted"});


   }catch(err){
    console.log("Error in deleting in issue", err)
    res.status(500).json("Server error");
   }
}

const getAllIssue = async (req, res)=>{
    const {id} = req.params;
    try{
const issue = Issue.find({repositary:id});

if(!issue){
    return res.status(404).json({error: "Issue not found"})
}

res.status(200).json(issue);
    }catch(err){
        console.log(err, "Error in get all issue")
        res.staus(500).json("Server error")
    }
}

const getIssueById = async (req, res)=>{
    res.send("all issue got by ID")
} 

module.exports = {
    createIssue,
    updateIssueById,
    deleteIssueById,
    getAllIssue,
    getIssueById
}