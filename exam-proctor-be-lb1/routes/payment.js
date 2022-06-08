const express = require('express')
const router = express.Router()
const { makePayment,verifyPayment } = require('../controllers/payment');
const { isSignedIn, isAuthenticated, isCreator, isLearner } = require("../controllers/auth");
const { getUserById } = require('../controllers/user');
const { getCourseById } = require('../controllers/course');


router.param("userId", getUserById);

router.param("courseId",getCourseById);

router.post("/orders/:userId",isSignedIn,isAuthenticated,isLearner, makePayment);

router.post("/verify/:courseId/:userId",isSignedIn,isAuthenticated,isLearner, verifyPayment);

module.exports = router