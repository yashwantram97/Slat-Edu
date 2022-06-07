var mongoose = require("mongoose")
const {ObjectId} = mongoose.Schema

var courseContentSchema = new mongoose.Schema({
    course: {
        type: ObjectId,
        ref: "Course",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    }
    },
    {timestamps:true}
)

module.exports = mongoose.model("CourseContent",courseContentSchema)