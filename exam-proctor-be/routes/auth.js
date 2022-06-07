const express = require('express')
const router = express.Router()
const {signOut,signUp,signin,isSignedIn} = require('../controllers/auth')
const { check, validationResult } = require('express-validator');

router.post("/signup",[
    check("name","name should be at least 3 char").isLength({min: 3}),
    check("email","email is required").isEmail(),
    check("password","password should be atleast 3 char").isLength({min:3})
],signUp)

router.post("/signin",[
    check("email","email is required").isEmail(),
    check("password","password should be atleast 3 char").isLength({min:3})
],signin)

router.get("/testroute",isSignedIn,(req,res) => {
    res.json({
        message: "protected route"
    })
})

router.get("/signout",signOut)

module.exports = router;