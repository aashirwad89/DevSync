const mongoose = require("mongoose");
const Repositary = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");


const createRepositary = async (req, res) => {
    const { owner, name, issues, content, description, visiblity } = req.body;

    try {
        if (!name) {
            return res.status(400).json({ message: "Repositary name is required" });
        }

        if (!mongoose.Types.ObjectId.isValid(owner)) {
            return res.status(400).json({ error: "Invalid UserID please try again" });
        }

        const newRepositary = new Repositary({
            name, description, visiblity, owner, content, issues
        });

        const result = await newRepositary.save();

        res.status(201).json({
            message: "Repositary created",
            repositaryId: result._id,
        });

    } catch (err) {
        console.log("Error while creating repo", err);
        res.status(500).json({ message: "Server Error" });
    }
};


const getAllRepositaries = async (req, res) => {
    try {
        const repositaries = await Repositary.find({})
            .populate("owner", "-password")
            .populate("issues");

        res.json(repositaries);

    } catch (err) {
        console.log("Error in getting all repos", err);
        res.status(500).json({ message: "Server error" });
    }
};


const fetchRepositaryById = async (req, res) => {
    const repoID = req.params.id;
    try {
        const repositary = await Repositary.findById(repoID)
            .populate("owner", "-password")
            .populate("issues");

        if (!repositary) {
            return res.status(404).json({ message: "Repository not found" });
        }

        res.json(repositary);

    } catch (err) {
        console.log("Error in fetching repo by ID", err);
        res.status(500).json({ message: "Server Error" });
    }
};


const fetchRepositaryByName = async (req, res) => {
    const repoName = req.params.name;
    try {
        const repositary = await Repositary.findOne({ name: repoName })
            .populate("owner", "-password")
            .populate("issues");

        if (!repositary) {
            return res.status(404).json({ message: "Repository not found" });
        }

        res.json(repositary);

    } catch (err) {
        console.log("Error in fetching repo by name", err);
        res.status(500).json({ message: "Server Error" });
    }
};


const fetchRepositaryForCurrentUser = async (req, res) => {
    const userId = req.user.id;
    try {
        const repositaries = await Repositary.find({ owner: userId })
            .populate("owner", "-password")
            .populate("issues");

        if (!repositaries || repositaries.length === 0) {
            return res.status(404).json({ error: "User Repositaries not found" });
        }

        res.json({ message: "Repositaries found!", repositaries });

    } catch (err) {
        console.log("Error in fetching repo for curr user", err);
        res.status(500).json({ message: "Server error" });
    }
};


const updateRepositaryById = async (req, res) => {
    const { id } = req.params;
    const { content, description } = req.body;
    try {
        const repositary = await Repositary.findById(id);

        if (!repositary) {
            return res.status(404).json({ message: "Repo is not found" });
        }

        repositary.content.push(content);
        repositary.description = description;

        const updatedRepositary = await repositary.save();

        res.json({
            message: "Repositary updated successfully",
            repositary: updatedRepositary
        });

    } catch (err) {
        console.log("Error in updating repo", err);
        res.status(500).json({ message: "Server Error" });
    }
};


const toggleVisiblityById = async (req, res) => {
    const { id } = req.params;
    try {
        const repositary = await Repositary.findById(id);

        if (!repositary) {
            return res.status(404).json({ message: "Repo is not found" });
        }

        repositary.visiblity = !repositary.visiblity;

        const updatedRepositary = await repositary.save();

        res.json({
            message: "Repositary visiblity toggled successfully",
            repositary: updatedRepositary
        });

    } catch (err) {
        console.log("Error in toggling repo", err);
        res.status(500).json({ message: "Server Error" });
    }
};


const deleteRepositaryById = async (req, res) => {
    const { id } = req.params;
    try {
        const repositary = await Repositary.findByIdAndDelete(id);

        if (!repositary) {
            return res.status(404).json({ message: "Repositary not found" });
        }

        res.json({ message: "Repositary Deleted Successfully" });

    } catch (err) {
        console.log("Error in deleting the repo", err);
        res.status(500).json({ message: "Server error" });
    }
};


module.exports = {
    createRepositary,
    getAllRepositaries,
    fetchRepositaryById,
    fetchRepositaryByName,
    fetchRepositaryForCurrentUser,
    updateRepositaryById,
    toggleVisiblityById,
    deleteRepositaryById
};