const mongoose = require('mongoose');

const repoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Repository name is required'],
    trim: true,
    maxlength: [100, 'Repository name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Repository owner is required']
  },
  collaborators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  stars: {
    type: Number,
    default: 0,
    min: [0, 'Stars cannot be negative']
  },
  repoPath: {
    type: String,
    // This will store the actual git repository path on server
  },
  defaultBranch: {
    type: String,
    default: 'main'
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Index for faster queries
repoSchema.index({ owner: 1, name: 1 }, { unique: true });
repoSchema.index({ collaborators: 1 });
repoSchema.index({ isPublic: 1 });

// Virtual for getting all contributors (owner + collaborators)
repoSchema.virtual('allContributors').get(function() {
  return [this.owner, ...this.collaborators];
});

// Method to check if user has access to repo
repoSchema.methods.hasAccess = function(userId) {
  if (this.isPublic) return true;
  if (this.owner.toString() === userId.toString()) return true;
  return this.collaborators.some(collab => collab.toString() === userId.toString());
};

// Method to check if user is owner
repoSchema.methods.isOwner = function(userId) {
  return this.owner.toString() === userId.toString();
};

const Repo = mongoose.model('Repo', repoSchema);

module.exports = Repo;