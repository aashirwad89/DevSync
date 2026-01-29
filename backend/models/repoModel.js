const mongoose = require('mongoose');
const { Schema } = mongoose;

const CommitSchema = new Schema({
    sha: { type: String, required: true, unique: true },
    message: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    timestamp: { type: Date, default: Date.now },
    changes: [{
        file: String,
        action: { type: String, enum: ['add', 'update', 'delete'] },
        content: String
    }]
});

const RepositorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    content: [{
        name: String,
        path: String,
        content: String,
        type: { type: String, enum: ['file', 'folder'] }
    }],
    visibility: {
        type: String,
        enum: ['public', 'private'],
        default: 'public'
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    collaborators: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    issues: [{
        type: Schema.Types.ObjectId,
        ref: "Issue"
    }],
    commits: [CommitSchema],
    branches: [{
        name: { type: String, default: 'main' },
        head: String
    }],
    stars: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model("Repository", RepositorySchema);
