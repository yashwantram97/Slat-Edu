var mongoose = require("mongoose")
const {ObjectId} = mongoose.Schema

var enrolledExamSchema = new mongoose.Schema({
    course: {
        type: ObjectId,
        ref: "Course",
        required: true
      },
    user : {
        type: ObjectId,
        ref: "User",
        required: true
    },
    coureseTaken : {
        type: Boolean,
        default: false,
        required: true
    },
    frequency : {
        type: Number,
        default: 0
    },
    score: {
        type: Number,
        default: 0
    },
    pass: {
        type: Boolean,
        default: false,
        required: true        
    }    
    },
    {timestamps:true}
)

enrolledExamSchema.index({course: 1, user: 1}, {unique: true})
module.exports = mongoose.model("EnrolledExam",enrolledExamSchema)