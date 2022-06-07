const Category = require("../models/category")
const { validationResult } = require('express-validator');

exports.addCategories = (req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(422).json({
            error: error.array()[0].msg
        })
    }

    Category.insertMany(req.body)
        .then(categories => {
        res.json({
            categories,
            message:"categories added successfully"
        })
    })
    .catch(err => {
        console.log("Something went wrong",err)
    })
}

exports.getCategoryById = (req,res,next,id) => {
    Category.findById(id).exec((err, cate) => {
        if(err){
            return res.status(400).json({
                error: "Category not found in DB"
            })
        }
        req.category = cate;
        next();
    })
}

exports.updateCategory = (req,res) => {
    const category = req.category;
    category.name = req.body.name;

    category.save((err, updateCategory) => {
        if(err){
            return res.status(400).json({
                error: "No category available in DB"
            });
        }
        return res.json(updateCategory)       
    })
}

exports.getAllCategories = (req, res) => {
    Category.find().exec((err,items) => {
        if(err){
            return res.status(400).json({
                error: "No category available in DB"
            });
        }
        res.json(items)
    })
}


exports.seedCategories = (req, res) => {

    const categoriesData = require("../models/seeding/category.json")

    Category.insertMany(categoriesData)
        .then(categories => {
        res.json({
            categories,
            message:"categories added successfully"
        })
    })
    .catch(err => {
        console.log("Something went wrong(catch)",err)
    })
}