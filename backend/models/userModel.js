const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    repositories: [{
        type: Schema.Types.ObjectId,
        ref: "Repository"
    }],
    followedUsers: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    starredRepositories: [{
        type: Schema.Types.ObjectId,
        ref: "Repository"
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model("User", UserSchema);
