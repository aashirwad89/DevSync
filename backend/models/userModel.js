const mongoose = require('mongoose');
const {Schema}  = mongoose;


const UserSchema = new Schema ({
    username:{
        type:String,
        required:true,
        unique: true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
password:{
    type:String,
},
repositaries:[
    {
        default: [],
        type:Schema.Types.ObjectId,
        ref: "Repositary"
    }
],
followedUsers:[
{
    default:[],
    type:Schema.Types.ObjectId,
    ref: "User",
}
],
starRepositary:[
    {
        default: [],
        type:Schema.Types.ObjectId,
        ref: "Repositary"
    }
],
})

const User = mongoose.model("User", UserSchema)


module.exports = User;