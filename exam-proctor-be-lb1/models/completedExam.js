var mongoose = require("mongoose")
const {ObjectId} = mongoose.Schema

var completedExamSchema = new mongoose.Schema({
    answers: {
        type: [String],
        default: []
    },
    course: {
        type: ObjectId,
        ref: "Course",
        required: true
    },
    exam: {
        type: ObjectId,
        ref: "Exam",
        required: true
    },
    takenBy: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    isCorrect: {
        type: Boolean,
        req: true,
        default: false
    }
    },
    {timestamps:true}
)

module.exports = mongoose.model("CompletedExam",completedExamSchema)