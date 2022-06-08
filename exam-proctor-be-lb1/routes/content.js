const express = require('express')
const router = express.Router()
const { addNewCourseContent,getContentById,getCourseContent,editContentByCourseId,getContentsByCourseId,deleteByContentId } = require('../controllers/content');
const { getCourseById} = require('../controllers/course');
const { isSignedIn, isAuthenticated, isCreator, isLearner } = require("../controllers/auth");
const { getUserById } = require('../controllers/user');


router.param("courseId",getCourseById);
router.param("contentId",getContentById);
router.param("userId", getUserById);

router.post("/add/content/:courseId",addNewCourseContent)

router.put("/edit/content/:contentId",editContentByCourseId)

router.get("/content/string/:contentId",getCourseContent)

router.get("/contents/:courseId/:userId",isSignedIn,isAuthenticated,getContentsByCourseId)

router.delete("/delete/:contentId/:userId",isSignedIn,isAuthenticated,isCreator,deleteByContentId)


module.exports = router