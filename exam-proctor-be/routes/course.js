const express = require('express')
const router = express.Router()
const { check, validationResult, body } = require('express-validator');
const { isSignedIn, isAdmin, isAuthenticated, isCreator, isLearner } = require("../controllers/auth");
const { createCourse,getCourseById,getCourse,getAllCourses,getCourseByCreatorId,getCourseByIds,getCourseAmountAndTime,updateTime } = require('../controllers/course');
const { getUserById } = require('../controllers/user');

router.param("userId", getUserById);

router.post("/add/course/:userId",[
    check("name","name should be at least 3 char").isLength({min: 3}),
    check("description","name should be at least 3 char").isLength({min: 10})
],isSignedIn,isAuthenticated,isCreator,createCourse)

router.param("courseId",getCourseById);

router.get("/course/:courseId/:userId",isSignedIn,isAuthenticated,getCourse)

router.get("/courses/:userId",isSignedIn,isAuthenticated,getAllCourses)

router.get("/creator/courses/:userId",isSignedIn,isAuthenticated,isCreator,getCourseByCreatorId)

router.post("/courses/ids/:userId",isSignedIn,isAuthenticated,isLearner,getCourseByIds)

router.get("/course/price/time/:courseId/:userId",isSignedIn,isAuthenticated,getCourseAmountAndTime)

router.post("/edit/course/time/:courseId/:userId",isSignedIn,isAuthenticated,isCreator,updateTime)

module.exports = router