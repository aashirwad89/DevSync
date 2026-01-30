const mongoose = require('mongoose');
const Repository = require('../models/repoModel');
const User = require('../models/userModel');
const { auth } = require('../middlewares/authMiddleware');

const createRepo = async (req, res) => {
    try {
        const { name, description, content, visibility } = req.body;

        if (!name) {
            return res.status(400).json({ 
                success: false, 
                message: "Repository name is required" 
            });
        }

        if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid User ID" 
            });
        }

        // Check if repo exists for user
        const existingRepo = await Repository.findOne({ 
            owner: req.user._id, 
            name 
        });
        if (existingRepo) {
            return res.status(400).json({ 
                success: false, 
                message: "Repository with this name already exists" 
            });
        }

        const newRepo = new Repository({
            name,
            description: description || '',
            content: content || [],
            visibility: visibility || 'public',
            owner: req.user._id
        });

        const result = await newRepo.save();

        // Add to user's repositories
        await User.findByIdAndUpdate(req.user._id, {
            $push: { repositories: result._id }
        });

        const populatedRepo = await Repository.findById(result._id)
            .populate('owner', 'username email');

        res.status(201).json({
            success: true,
            message: "Repository created successfully!",
            repository: populatedRepo
        });
    } catch (err) {
        console.log("Create repo error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const getAllRepos = async (req, res) => {
    try {
        const { owner } = req.query;
        const filter = owner ? { owner } : {};

        const repos = await Repository.find(filter)
            .populate("owner", "username")
            .populate("issues")
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json({ 
            success: true, 
            count: repos.length, 
            repositories: repos 
        });
    } catch (err) {
        console.log("Error getting all repos:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const getRepoById = async (req, res) => {
    try {
        const { id } = req.params;
        const repo = await Repository.findById(id)
            .populate('owner', 'username email')
            .populate('collaborators', 'username')
            .populate('issues');

        if (!repo) {
            return res.status(404).json({ 
                success: false, 
                message: "Repository not found" 
            });
        }

        res.status(200).json({ 
            success: true, 
            repository: repo 
        });
    } catch (err) {
        console.log("Error fetching repo by ID:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const getRepoByName = async (req, res) => {
    try {
        const { repoName } = req.params;
        const repo = await Repository.findOne({ name: repoName })
            .populate('owner', 'username')
            .populate('issues');

        if (!repo) {
            return res.status(404).json({ 
                success: false, 
                message: "Repository not found" 
            });
        }

        res.status(200).json({ 
            success: true, 
            repository: repo 
        });
    } catch (err) {
        console.log("Error fetching repo by name:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const getReposByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const repos = await Repository.find({ owner: userId })
            .populate('owner', 'username');

        if (!repos || repos.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "No repositories found for user" 
            });
        }

        res.json({ 
            success: true, 
            message: "Repositories found!", 
            repositories: repos 
        });
    } catch (err) {
        console.log("Error fetching repos for user:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const updateRepoById = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, content, visibility } = req.body;

        const repo = await Repository.findById(id);
        if (!repo) {
            return res.status(404).json({ 
                success: false, 
                message: "Repository not found" 
            });
        }

        if (name) repo.name = name;
        if (description !== undefined) repo.description = description;
        if (content) repo.content.push(content);
        if (visibility) repo.visibility = visibility;

        const updatedRepo = await repo.save();

        res.json({
            success: true,
            message: "Repository updated successfully",
            repository: updatedRepo
        });
    } catch (err) {
        console.log("Error updating repo:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const toggleVisibility = async (req, res) => {
    try {
        const { id } = req.params;
        const repo = await Repository.findById(id);
        
        if (!repo) {
            return res.status(404).json({ 
                success: false, 
                message: "Repository not found" 
            });
        }

        repo.visibility = repo.visibility === 'public' ? 'private' : 'public';
        await repo.save();

        res.json({
            success: true,
            message: "Visibility toggled successfully",
            visibility: repo.visibility
        });
    } catch (err) {
        console.log("Error toggling visibility:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const deleteRepoById = async (req, res) => {
    try {
        const { id } = req.params;
        const repo = await Repository.findByIdAndDelete(id);
        
        if (!repo) {
            return res.status(404).json({ 
                success: false, 
                message: "Repository not found" 
            });
        }

        // Remove from user's repositories
        await User.updateMany(
            { repositories: id },
            { $pull: { repositories: id } }
        );

        // Delete related issues
        await Issue.deleteMany({ repository: id });

        res.json({ 
            success: true, 
            message: "Repository deleted successfully" 
        });
    } catch (err) {
        console.log("Error deleting repo:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = {
    createRepo,
    getAllRepos,
    getRepoById,
    getRepoByName,
    getReposByUser,
    updateRepoById,
    toggleVisibility,
    deleteRepoById
};
