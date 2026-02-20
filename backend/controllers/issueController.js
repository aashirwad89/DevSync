const mongoose = require('mongoose');
const Repositary = require("../models/repoModel");
const User = require("../models/userModel");
const Issues = require("../models/issueModel");


const createIssue = async (req, res) => {
    const { title, description } = req.body;
    const { id } = req.params;

    try {
        const issue = new Issues({
            title,
            description,
            repositary: id,
        });

        await issue.save();  // issues → issue

        res.status(201).json(issue);

    } catch (err) {
        console.log("Error in creating issues", err);
        res.status(500).json({ message: "Server error" });
    }
};


const updateIssueById = async (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;
    try {
        const issue = await Issues.findById(id);  // findbyId → findById

        if (!issue) {
            return res.status(404).json({ error: "Issue not found" });
        }

        issue.title = title;
        issue.description = description;
        issue.status = status;

        await issue.save();

        res.json(issue);

    } catch (err) {
        console.log("Error in updating issue", err);
        res.status(500).json({ message: "Server error" });
    }
};


const deleteIssueById = async (req, res) => {
    const { id } = req.params;
    try {
        const issue = await Issues.findByIdAndDelete(id);  // Isues → Issues

        if (!issue) {
            return res.status(404).json({ message: "Issue not found" });
        }

        res.json({ message: "Issue deleted" });

    } catch (err) {
        console.log(err, "Error in deleting issue by id");
        res.status(500).json({ message: "Server Error" });
    }
};


const getAllIssues = async (req, res) => {
    const { id } = req.params;
    try {
        const issues = await Issues.find({ repositary: id });  // await added

        if (!issues || issues.length === 0) {  // proper null check
            return res.status(404).json({ message: "Issues not found" });
        }

        res.status(200).json(issues);

    } catch (err) {
        console.log("Error in getting all issues", err);
        res.status(500).json({ message: "Server Error" });
    }
};


const getIssuebyId = async (req, res) => {
    const { id } = req.params;
    try {
        const issue = await Issues.findById(id);  // await added, {} → id

        if (!issue) {
            return res.status(404).json({ message: "Issue not found" });
        }

        res.json(issue);

    } catch (err) {
        console.log("Error in getting issue by ID", err);
        res.status(500).json({ message: "Server Error" });
    }
};


module.exports = {
    createIssue,
    updateIssueById,
    deleteIssueById,
    getAllIssues,
    getIssuebyId
};