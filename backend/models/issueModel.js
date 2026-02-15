const mongoose = require('mongoose');
const {Schema} = mongoose;

const issueSchema = new Schema({
    title:{
        type:String,
        require: true,
    },
    description: {
        type:String,
        require: true,
    },
    status:{
        type:String,
        enum:["open", "closed"],
        default: "open"
    }, 
    repositary:{
        type: Schema.Types.ObjectId,
        ref: "Repositary",
        require: true,
    }, 
})

const Issues = mongoose.model("Issues", issueSchema);

export default Issues;