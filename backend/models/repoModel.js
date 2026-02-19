const mongoose = require('mongoose');
const {Schema} = mongoose;

const RepositarySchema = new Schema({
    name:{
        type:String,
        require: true,
        unique: true,
    },
    description:{
        type:String,
    },
    content: [
        {
            type: String,
        },
    ],
    visiblity:{
        type: Boolean,
    }, 
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    issues: [
        {
            type: Schema.Types.ObjectId,
            ref:"Issues"
        }
    ]

})

const Repositary = mongoose.model("Repositary", RepositarySchema);

module.exports = Repositary;