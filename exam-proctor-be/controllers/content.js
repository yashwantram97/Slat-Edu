var mongo = require('mongodb');
var stream = require('stream');
const { v4: uuidv4 } = require('uuid');
const CourseContent = require('../models/courseContent');
var MongoClient = mongo.MongoClient;
var mongoose = require("mongoose")
const {ObjectId} = mongoose.Types

exports.getContentById = (req,res,next,id) => {
  CourseContent.findById(id).exec((err,content) => {
      if(err || !content){
          return res.status(400).json({
              error: "No user was found in DB"
          })
      }
      req.content = content;
      next();
  })
}

const getFileSystemItem = (dbo, filename) => {
  var buf = new Buffer.from('');
  return new Promise(function(resolve, reject) {
    var bucket = new mongo.GridFSBucket(dbo);
    var readstream = bucket.openDownloadStream(filename);
    readstream.on('data', (chunk) => {
      buf = Buffer.concat([buf, chunk]);
    });
    readstream.on('error', (err) => {
        reject(err);
    });
    readstream.on('end', () => {
        var res = buf.toString();
        buf = null; // Clean up memory
        readstream.destroy();
        resolve(res);
    });
  });
}

const putFileSystemItem = (dbo, filename, data) => {
  var putItemHelper = function(bucket, resolve, reject) {
    var writeStream = bucket.openUploadStreamWithId(filename, filename);
    var s = new stream.Readable();
    s.push(data);
    s.push(null); // Push null to end stream
    s.pipe(writeStream);
    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
  };
  return new Promise(function(resolve, reject) {
    var bucket = new mongo.GridFSBucket(dbo);
    bucket.find({_id: filename}).count(function(err, count) {
      if (err) return reject(err);
      if (count > 0) {
          bucket.delete(filename, function() {
          putItemHelper(bucket, resolve, reject);
        }, reject)
      } else {
        putItemHelper(bucket, resolve, reject);
      }
    }, reject);
  });
}

exports.addNewCourseContent = (req,res) => {
  var MongoUrl = process.env.DATABASE_FILE;
  var dbName = process.env.DATABASE_FILE_DB;
  const course = req.course
  
  MongoClient.connect(MongoUrl,{ useUnifiedTopology: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);

    const string = req.body.htmlString
    const title = req.body.title
    const filename = uuidv4()
  
    putFileSystemItem(dbo, filename, string)
    .then(function(a) {
      console.log('Wrote a gridFS file with metadata:', a);
      //return getFileSystemItem(dbo, filename)
      db.close();
      const courseContent = new CourseContent({
        course: new ObjectId(course._id),
        filename: filename,
        title: title
      })
      courseContent.save((err,courseCont) => {
        if(err){
            return res.status(400).json({
                err: "NOT able to save user in DB"
            })
        }
        res.json({
            status:true,
            message:"Content save successfully",
            id: courseCont._id,
            filename:filename
        })
    })    
    })
    .catch(function(e) {
      console.log(e);
      db.close();
      res.json({
        status:false,
        message:"Failed to save string to grid"
    })
  })
  });
}


exports.getCourseContent = (req,res) => {
  var MongoUrl = process.env.DATABASE_FILE;
  var dbName = process.env.DATABASE_FILE_DB;
    
  MongoClient.connect(MongoUrl,{ useUnifiedTopology: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);

    getFileSystemItem(dbo, req.content.filename).then(string => {
        db.close();
        res.json({
          status:true,
          string,
          title: req.content.title
      })
    })
    .catch(e => {
        console.log(e);
        db.close();
        res.json({
          status:false,
          message:"Failed to fetch string from grid"
      })   
    })
  })
}

exports.getContentsByCourseId = (req,res) => {
  let courseId = new ObjectId(req.course._id);

  const query = { course: courseId}
  CourseContent.find(query)
  .exec((err, courseContent) => {
      if(err){
          return res.status(400).json({
              error: "No course found in DB"
          })
      }
      res.json(courseContent)
  })
}

exports.editContentByCourseId = (req,res) => {
  var MongoUrl = process.env.DATABASE_FILE;
  var dbName = process.env.DATABASE_FILE_DB;
  const content = req.content
  
  MongoClient.connect(MongoUrl,{ useUnifiedTopology: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);

    const string = req.body.htmlString
    const title = req.body.title
    const filename = content.filename
  
    putFileSystemItem(dbo, filename, string)
    .then(function(a) {
      console.log('Wrote a gridFS file with metadata:', a);
      db.close();
      CourseContent.updateOne(
        {_id:content._id},
        {$set: {title: title}},
            (err, courseCont) => {
            if(err){
              res.json({
                status:false,
                message:"Failed to update title",
            })
                }
                res.json({
                  status:true,
                  message:"Content updated successfully",
                  id: courseCont._id,
                  filename:courseCont.filename,
                  title:courseCont.title
              })
              }
    )
    })
    .catch(function(e) {
      console.log(e);
      db.close();
      res.json({
        status:false,
        message:"Failed to update string to grid"
    })
  })
  });
}

exports.deleteByContentId = (req,res) => {
  const contentId = req.content._id
  CourseContent.deleteOne({_id: new ObjectId(contentId)},(err) => {
    if(err){
      console.log(err)
      res.json({
        status:false,
        message:"Something went wrong"
      })
    }else{
      res.json({
        status: true,
        message: "Deleted successfully"
      })
    }
  })
}