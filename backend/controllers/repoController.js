const Repo = require('../models/repoModel');
const User = require('../models/userModel');

// Get all repositories
const getAllRepos = async (req, res) => {
  try {
    const repos = await Repo.find()
      .populate('owner', 'username email')
      .populate('collaborators', 'username email')
      .sort({ updatedAt: -1 });
    
    res.status(200).json({
      success: true,
      count: repos.length,
      data: repos
    });
  } catch (error) {
    console.error('Error in getAllRepos:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch repositories',
      error: error.message
    });
  }
};

// Get single repository by ID
const getRepoById = async (req, res) => {
  try {
    const repo = await Repo.findById(req.params.id)
      .populate('owner', 'username email')
      .populate('collaborators', 'username email');
    
    if (!repo) {
      return res.status(404).json({
        success: false,
        message: 'Repository not found'
      });
    }

    res.status(200).json({
      success: true,
      data: repo
    });
  } catch (error) {
    console.error('Error in getRepoById:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch repository',
      error: error.message
    });
  }
};

// Create new repository
const createRepo = async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;
    const userId = req.user._id; // From auth middleware

    // Check if repo with same name already exists for this user
    const existingRepo = await Repo.findOne({ 
      name, 
      owner: userId 
    });

    if (existingRepo) {
      return res.status(400).json({
        success: false,
        message: 'Repository with this name already exists'
      });
    }

    const repo = await Repo.create({
      name,
      description,
      isPublic: isPublic !== undefined ? isPublic : true,
      owner: userId,
      stars: 0,
      collaborators: []
    });

    const populatedRepo = await Repo.findById(repo._id)
      .populate('owner', 'username email');

    res.status(201).json({
      success: true,
      message: 'Repository created successfully',
      data: populatedRepo
    });
  } catch (error) {
    console.error('Error in createRepo:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create repository',
      error: error.message
    });
  }
};

// Update repository
const updateRepo = async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;
    const userId = req.user._id;

    const repo = await Repo.findById(req.params.id);

    if (!repo) {
      return res.status(404).json({
        success: false,
        message: 'Repository not found'
      });
    }

    // Check if user is owner
    if (repo.owner.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this repository'
      });
    }

    repo.name = name || repo.name;
    repo.description = description || repo.description;
    repo.isPublic = isPublic !== undefined ? isPublic : repo.isPublic;
    
    await repo.save();

    const updatedRepo = await Repo.findById(repo._id)
      .populate('owner', 'username email')
      .populate('collaborators', 'username email');

    res.status(200).json({
      success: true,
      message: 'Repository updated successfully',
      data: updatedRepo
    });
  } catch (error) {
    console.error('Error in updateRepo:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update repository',
      error: error.message
    });
  }
};

// Delete repository
const deleteRepo = async (req, res) => {
  try {
    const userId = req.user._id;
    const repo = await Repo.findById(req.params.id);

    if (!repo) {
      return res.status(404).json({
        success: false,
        message: 'Repository not found'
      });
    }

    // Check if user is owner
    if (repo.owner.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this repository'
      });
    }

    await repo.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Repository deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteRepo:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete repository',
      error: error.message
    });
  }
};

// Get user's repositories
const getUserRepos = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;

    const repos = await Repo.find({
      $or: [
        { owner: userId },
        { collaborators: userId }
      ]
    })
      .populate('owner', 'username email')
      .populate('collaborators', 'username email')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: repos.length,
      data: repos
    });
  } catch (error) {
    console.error('Error in getUserRepos:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user repositories',
      error: error.message
    });
  }
};

// Add collaborator to repository
const addCollaborator = async (req, res) => {
  try {
    const { userId: collaboratorId } = req.body;
    const repoId = req.params.id;
    const ownerId = req.user._id;

    const repo = await Repo.findById(repoId);

    if (!repo) {
      return res.status(404).json({
        success: false,
        message: 'Repository not found'
      });
    }

    // Check if user is owner
    if (repo.owner.toString() !== ownerId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only repository owner can add collaborators'
      });
    }

    // Check if collaborator exists
    const collaborator = await User.findById(collaboratorId);
    if (!collaborator) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already a collaborator
    if (repo.collaborators.includes(collaboratorId)) {
      return res.status(400).json({
        success: false,
        message: 'User is already a collaborator'
      });
    }

    repo.collaborators.push(collaboratorId);
    await repo.save();

    const updatedRepo = await Repo.findById(repo._id)
      .populate('owner', 'username email')
      .populate('collaborators', 'username email');

    res.status(200).json({
      success: true,
      message: 'Collaborator added successfully',
      data: updatedRepo
    });
  } catch (error) {
    console.error('Error in addCollaborator:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add collaborator',
      error: error.message
    });
  }
};

// Remove collaborator from repository
const removeCollaborator = async (req, res) => {
  try {
    const { userId: collaboratorId } = req.body;
    const repoId = req.params.id;
    const ownerId = req.user._id;

    const repo = await Repo.findById(repoId);

    if (!repo) {
      return res.status(404).json({
        success: false,
        message: 'Repository not found'
      });
    }

    // Check if user is owner
    if (repo.owner.toString() !== ownerId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only repository owner can remove collaborators'
      });
    }

    repo.collaborators = repo.collaborators.filter(
      id => id.toString() !== collaboratorId
    );
    await repo.save();

    const updatedRepo = await Repo.findById(repo._id)
      .populate('owner', 'username email')
      .populate('collaborators', 'username email');

    res.status(200).json({
      success: true,
      message: 'Collaborator removed successfully',
      data: updatedRepo
    });
  } catch (error) {
    console.error('Error in removeCollaborator:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove collaborator',
      error: error.message
    });
  }
};

module.exports = {
  getAllRepos,
  getRepoById,
  createRepo,
  updateRepo,
  deleteRepo,
  getUserRepos,
  addCollaborator,
  removeCollaborator
};