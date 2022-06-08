const express = require("express")
const router = express.Router()

const {detectFaces,analyseFace} = require('../controllers/face')

router.post("/face/register", detectFaces);

router.post("/face/analyse",analyseFace);
module.exports = router

