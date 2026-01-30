const Issue = require("../models/issueModel");
const Repository = require("../models/repoModel");
const auth = require('../middlewares/authMiddleware').auth;

const createIssue = async (req, res) => {
    try {
        const { title, description, labels } = req.body;
        const repoId = req.params.repoId;

        if (!title || !description) {
            return res.status(400).json({ 
                success: false, 
                message: "Title and description required" 
            });
        }

        const repo = await Repository.findById(repoId);
        if (!repo) {
            return res.status(404).json({ 
                success: false, 
                message: "Repository not found" 
            });
        }

        const issue = new Issue({
            title,
            description,
            repository: repoId,
            author: req.user._id,
            labels: labels || []
        });

        await issue.save();

        // Add to repo issues
        repo.issues.push(issue._id);
        await repo.save();

        const populatedIssue = await Issue.findById(issue._id)
            .populate('author', 'username')
            .populate('repository', 'name');

        res.status(201).json({ 
            success: true, 
            issue: populatedIssue 
        });
    } catch (err) {
        console.log("Error creating issue:", err);
        res.status(500).json({ 
            success: false, 
            message: "Server Error" 
        });
    }
};

const updateIssueById = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const issue = await Issue.findById(id);
        if (!issue) {
            return res.status(404).json({ 
                success: false, 
                message: "Issue not found" 
            });
        }

        // Update only provided fields
        Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined && updateData[key] !== null) {
                issue[key] = updateData[key];
            }
        });

        await issue.save();

        const updatedIssue = await Issue.findById(id)
            .populate('author', 'username')
            .populate('assignee', 'username');

        res.json({ 
            success: true, 
            message: "Issue updated successfully", 
            issue: updatedIssue 
        });
    } catch (err) {
        console.log("Error updating issue:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const deleteIssueById = async (req, res) => {
    try {
        const { id } = req.params;
        const issue = await Issue.findByIdAndDelete(id);

        if (!issue) {
            return res.status(404).json({ 
                success: false, 
                message: "Issue not found" 
            });
        }

        // Remove from all repos
        await Repository.updateMany(
            { issues: id }, 
            { $pull: { issues: id } }
        );

        res.json({ 
            success: true, 
            message: "Issue deleted successfully" 
        });
    } catch (err) {
        console.log("Error deleting issue:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const getAllIssues = async (req, res) => {
    try {
        const repoId = req.query.repoId || req.params.repoId;

        const filter = repoId ? { repository: repoId } : {};
        const issues = await Issue.find(filter)
            .populate('author', 'username')
            .populate('assignee', 'username')
            .populate('repository', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({ 
            success: true, 
            count: issues.length, 
            issues 
        });
    } catch (err) {
        console.log("Error getting issues:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const getIssueById = async (req, res) => {
    try {
        const { id } = req.params;
        const issue = await Issue.findById(id)
            .populate('author', 'username email')
            .populate('assignee', 'username')
            .populate('repository', 'name owner');

        if (!issue) {
            return res.status(404).json({ 
                success: false, 
                message: "Issue not found" 
            });
        }

        res.json({ 
            success: true, 
            issue 
        });
    } catch (err) {
        console.log("Error getting issue:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = {
    createIssue,
    updateIssueById,
    deleteIssueById,
    getAllIssues,
    getIssueById
};
