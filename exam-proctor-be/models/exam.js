var mongoose = require("mongoose")
const {ObjectId} = mongoose.Schema

var courseSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        maxLegth: 32,
        trim: true
    },
    choices: {
        type: [String],
        trim: true,
        required: true
    },
    answers: {
        type: [String],
        trim: true,
        required: true
    },
    course: {
        type: ObjectId,
        ref: "Course",
        required: true
      },
    answerType: {
        type: String,
        enum : ['multiple','single'],
        default: 'single'
    },
    createdBy: {
        type: ObjectId,
        ref: "User",
        required: true
    }    
    },
    {timestamps:true}
)

module.exports = mongoose.model("Exam",courseSchema)