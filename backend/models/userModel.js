const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        require: true,
        unique:true,
    }, 
    email: {
        type:String,
        require: true,
        unique: true,
    }, 
    password: {
        type: String,
        require: true,
    },
    repositaries: [
        {
            default:[],
            type: Schema.Types.ObjectId,
            ref: "Repositary"
        },
    ],
     followedUsers: [
        {
            default:[],
            type: Schema.Types.ObjectId,
            ref: "Users"
        },
    ],
     starRepos: [
        {
            default:[],
            type: Schema.Types.ObjectId,
            ref: ""
        },
    ],
})

const User = mongoose.model("User", userSchema);

export default User;