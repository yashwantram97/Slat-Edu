const EnrolledExam = require("../models/enrolledExam")
var mongoose = require("mongoose")
const Course = require("../models/course")
const {ObjectId} = mongoose.Types

exports.profileLearner = async (req,res) => {
    let userId = new ObjectId(req.profile._id)

    const query = { user: userId}
    EnrolledExam.find(query)
    .populate('course','name image')
    .exec((err, exams) => {
        if(err){
            return res.status(400).json({
                error: "No course found in DB"
            })
        }

        res.json(exams)
    })
} 

exports.profileCreator = async (req,res) => {
    let userId = req.profile._id

    let aggregate = [{$group:{_id:"$course",count:{$count:{}}}}]

    const aggResult = await EnrolledExam.aggregate(aggregate)

    const data = await Course.populate(aggResult, { path: '_id', select: 'name createdAt updatedAt image createdBy' });
    
    return res.json(data.filter(value => value._id.createdBy.toString() === userId.toString()))
} 
