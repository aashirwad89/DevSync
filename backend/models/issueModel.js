const mongoose = require('mongoose');
const { Schema } = mongoose;

const CommentSchema = new Schema({
    text: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    timestamp: { type: Date, default: Date.now }
});

const IssueSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["open", "closed"],
        default: "open"
    },
    repository: {
        type: Schema.Types.ObjectId,
        ref: "Repository",
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    assignee: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    labels: [{
        type: String
    }],
    comments: [CommentSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model("Issue", IssueSchema);
