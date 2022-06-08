const express = require('express')
const router = express.Router()
const { isSignedIn, isAuthenticated, isCreator, isLearner } = require("../controllers/auth");
const { getUserById } = require('../controllers/user');
const {profileCreator,profileLearner} = require('../controllers/profile')

router.param("userId", getUserById);

router.get("/profile/learner/:userId",isSignedIn,isAuthenticated,isLearner,profileLearner)

router.get("/profile/creator/:userId",isSignedIn,isAuthenticated,isCreator,profileCreator)

module.exports = router