var mongoose = require("mongoose")
const {ObjectId} = mongoose.Schema

var courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLegth: 32,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        trim: true,
        default: 'https://img.favpng.com/23/7/4/computer-icons-educational-technology-learning-training-course-png-favpng-j5t2UTpdMx23LZhscuTVqAJGb.jpg'
    },
    category: {
        type: ObjectId,
        ref: "Category",
        required: true
      },
    passPercentage: {
        type: Number,
        default: 50        
    },
    examTimeLimit: {
        type: Number,
        default: 30
    },
    examPrice: {
        type: Number,
        default: 99
    },
    createdBy: {
        type: ObjectId,
        ref: "User",
        required: true
    }     
    },
    {timestamps:true}
)

module.exports = mongoose.model("Course",courseSchema)