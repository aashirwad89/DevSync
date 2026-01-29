const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 1. Basic Auth Middleware
const auth = async (req, res, next) => {
    try {
        // Token header se nikalo (Bearer token)
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Access denied. No token provided.' 
            });
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid token.' 
            });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ 
            success: false, 
            message: 'Invalid token.' 
        });
    }
};

// 2. Owner/Admin Only Middleware
const isOwnerOrAdmin = async (req, res, next) => {
    try {
        const { user } = req;
        
        // Check if user is owner of resource
        if (req.params.id !== user._id.toString()) {
            return res.status(403).json({ 
                success: false, 
                message: 'Access denied. Not authorized.' 
            });
        }
        
        next();
    } catch (error) {
        res.status(403).json({ 
            success: false, 
            message: 'Server error.' 
        });
    }
};

// 3. Repository Owner/Collaborator Middleware
const isRepoOwnerOrCollaborator = async (req, res, next) => {
    try {
        const Repository = require('../models/Repository');
        const repo = await Repository.findById(req.params.id);
        
        if (!repo) {
            return res.status(404).json({ 
                success: false, 
                message: 'Repository not found.' 
            });
        }

        const userId = req.user._id.toString();
        const isOwner = repo.owner.toString() === userId;
        const isCollaborator = repo.collaborators.some(collab => collab.toString() === userId);

        if (!isOwner && !isCollaborator) {
            return res.status(403).json({ 
                success: false, 
                message: 'Access denied. Not a collaborator.' 
            });
        }

        req.repo = repo;
        next();
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Server error.' 
        });
    }
};

module.exports = {
    auth,
    isOwnerOrAdmin,
    isRepoOwnerOrCollaborator
};
