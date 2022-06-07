const express = require('express')
const router = express.Router()
const { check, validationResult, body } = require('express-validator');
const { isSignedIn, isAdmin, isAuthenticated, isCreator, isLearner } = require("../controllers/auth");
const { getUserById } = require('../controllers/user');
const { getCourseById } = require('../controllers/course');
const { addQuestion,getQuestions,enrollInCourse,isEnrolled,submitExam,getQuestionDetail,getQuestion,editQuestion,getCreatorQuestionsByCourseId,generateCertificate,checkIfLearnerCanEnroll,checkExamAttempts } = require('../controllers/exam');

router.param("userId", getUserById);

router.param("courseId",getCourseById);

router.param("examId",getQuestion);

router.get("question/:examId/:userId",isSignedIn,isAuthenticated,isCreator,getQuestionDetail)

router.post("/add/question/:courseId/:userId",isSignedIn,isAuthenticated,isCreator,addQuestion)

router.put("/edit/question/:courseId/:userId",isSignedIn,isAuthenticated,isCreator,editQuestion)

router.get("/questions/:courseId/:userId",isSignedIn,isAuthenticated,isLearner,getQuestions)

router.get("/creator/questions/:courseId/:userId",isSignedIn,isAuthenticated,isCreator,getCreatorQuestionsByCourseId)

router.get("/exam/enroll/:courseId/:userId",isSignedIn,isAuthenticated,isLearner,enrollInCourse)

router.get("/check/enroll/:courseId/:userId",isSignedIn,isAuthenticated,isLearner,isEnrolled)

router.post("/submit/exam/:courseId/:userId",isSignedIn,isAuthenticated,isLearner,submitExam)

router.get('/certificate/:courseId/:userId',isLearner,generateCertificate)

router.get('/check/enroll/:courseId/',isSignedIn,isAuthenticated,checkIfLearnerCanEnroll)

router.get('/check/exam/frequency/:courseId/:userId',isSignedIn,isAuthenticated,isLearner,checkExamAttempts)

module.exports = router