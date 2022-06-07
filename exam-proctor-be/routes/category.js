const express = require('express')
const router = express.Router()
const {signOut,signUp,signin,isSignedIn} = require('../controllers/auth')
const { check, validationResult, body } = require('express-validator');
const { addCategories, seedCategories,getCategoryById, updateCategory, getAllCategories } = require('../controllers/category');

router.param('categoryId',getCategoryById)

router.post("/add/categories",[
    body().isArray(),
    body('*.name', 'name should have minimum of three charectors').isLength({min: 3}),
],addCategories)

router.put("/category/:categoryId",[
    check("name","name should be at least 3 char").isLength({min: 3}),
],updateCategory)

router.get("/categories",getAllCategories)

router.get("/seeding/categories",seedCategories)

module.exports = router