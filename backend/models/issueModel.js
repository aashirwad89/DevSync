const mongoose = require('mongoose');
const {Schema} = mongoose;

const IssueSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum:["open", "closed"],
        default: "open"
    },
repositary:{
    type:Schema.Types.ObjectId,
    ref:"Repositary",
    required:true
},
})

const Issue = mongoose.model("Issue", IssueSchema);
export default Issue;