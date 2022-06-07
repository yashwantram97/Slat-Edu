const Course = require("../models/course")
const { validationResult } = require('express-validator');
var mongoose = require("mongoose")
const {ObjectId} = mongoose.Types

exports.createCourse = (req,res) => {    
    const error = validationResult(req);

    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()[0].msg
        })
    }

    const course = new Course(req.body)
    course.save((err,course) => {
        if(err){
            return res.status(400).json({
                err: "NOT able to save user in DB"
            })
        }
        res.json({
            name: course.name,
            image: course.image,
            id: course._id
        })
    })
}

exports.getCourseById = (req,res,next,id) => {
    Course.findById(id).exec((err,course) => {
        if(err || !course){
            return res.status(400).json({
                error: "No user was found in DB"
            })
        }
        req.course = course;
        next();
    })
}

exports.getCourseByIds = (req,res) => {
    
    const categoryIds = req.body.categoryIds.map(courseId => new ObjectId(courseId))

    Course.find().where('category').in(categoryIds).exec((err,courses) => {
        if(err || !courses){
            console.log(err)
            return res.status(400).json({
                error: "No user was found in DB"
            })
        }
        return res.json(courses)
    })
}


exports.getCourseByCreatorId = (req,res) => {
    let userId = new ObjectId(req.profile._id)
    const query = {createdBy: userId}

    Course.find(query).exec((err,courses) => {
        if(err || !courses){
            return res.status(400).json({
                error: "No user was found in DB"
            })
        }
        res.json(courses)
    })

}

exports.getCourse = (req, res) => {
    return res.json(req.course)
}

exports.getAllCourses = (req, res) => {
    Course.find().exec((err,items) => {
        if(err){
            return res.status(400).json({
                error: "No category available in DB"
            });
        }
        res.json(items)
    })
}

exports.getCourseAmountAndTime = (req,res) => {
    res.json({
        courseId: req.course._id,
        amount: req.course.examPrice,
        time: req.course.examTimeLimit,
    })
}

exports.updateTime = (req,res) => {

    const courseId = new ObjectId(req.course._id)
    const {examTime} = req.body

    console.log(examTime)

    Course.updateOne(
        {_id:courseId},
        {$set: {examTimeLimit: parseInt(examTime) }},
            (err, course) => {
            if(err){
                console.log("something went wrong while updating enrolled user ",err)
                return res.send({
                    error: "Something went wrong while editing time"
                })
                }
            return res.json(course)
        }
    )

}