const Exam = require("../models/exam")
const Course = require("../models/course")
const EnrolledExam = require("../models/enrolledExam")
const CompletedExam = require("../models/completedExam")
const { validationResult } = require('express-validator');
var mongoose = require("mongoose")
const {ObjectId} = mongoose.Types
const fs = require('fs');
const PDFDocument =  require('pdfkit');

exports.addQuestion = (req,res) => {

    const exam = new Exam(req.body)
    exam.save((err,exam) => {
        if(err){
            return res.status(400).json({
                err: "NOT able to save user in DB"
            })
        }
        res.json({
            message:"Question added successfully",
            id: exam._id
        })
    })    
}

exports.editQuestion = (req,res) => {

    console.log(req.body)
    const {question,choices,answers,answerType} = req.body

    Exam.updateOne(
        {_id: new ObjectId(req.body.id)},
        {$set: {question:req.body.question,
                choices:req.body.choices,
                answers:req.body.answers,
                answerType:req.body.answerType
            }},
            (err, question) => {
            if(err){
                console.log("something went wrong while editing questing",err)
                return res.json({
                    status:false,
                    error:"something went wrong while editing questing "
                })
                }
                console.log("question updated successfully",question)
                return res.json(question)
        }
    )


    
}


exports.getQuestions = async (req,res) => {
    let o_id = new ObjectId(req.course._id);
    let userId = new ObjectId(req.profile._id)

    const query = { course: o_id}
    const options =  { _id: 1, question: 1,choices:1,answerType:1 } 
    let enrolledUser = await getEnrolledLearner(o_id,userId)
    Exam.find(query,options)
    .exec((err, exams) => {
        if(err){
            return res.status(400).json({
                error: "No course found in DB"
            })
        }

        if(enrolledUser[0].frequency >= 3){
            return res.status(400).json({
                error: "You have reached maximum attempts"
            })
        }
        
        EnrolledExam.updateOne(
            {_id:enrolledUser[0]._id},
            {$set: { frequency: enrolledUser[0].frequency +1 }},
                (err, enUser) => {
                if(err){
                    console.log("something went wrong while updating enrolled user ",err)
                }
                console.log("Enrolled user updated successfully",enUser)
            }
        )
        
        res.json(exams)
    })
} 

exports.getCreatorQuestionsByCourseId = (req,res) => {
    let o_id = new ObjectId(req.course._id);

    const query = { course: o_id}
    Exam.find(query)
    .exec((err, exams) => {
        if(err){
            return res.status(400).json({
                error: "No course found in DB"
            })
        }
        res.json(exams)
    })
}

exports.getQuestion = (req,res,next,id) => {
    let examId = new ObjectId(id);

    const query = { _id: examId}
    Exam.find(query,options)
    .exec((err, exam) => {
        if(err){
            return res.status(400).json({
                error: "No course found in DB"
            })
        }
        req.exam = exam
        next()
    })
} 

exports.getQuestionDetail = (req,res) => {
    res.json(req.exam)
}

exports.enrollInCourse = (req,res) => {
    let courseId = new ObjectId(req.course._id);
    let userId = new ObjectId(req.profile._id)

    const enrollment = {
        course: courseId,
        user: userId,
    }

    const enrolledExam = new EnrolledExam(enrollment)
    enrolledExam.save((err,enExam) => {
        if(err){
            return res.status(400).json({
                err: "NOT able to save user in DB"
            })
        }
        res.json({
            message:"Exam enrolled successfully",
            id: enExam._id
        })
    })    
}

exports.enrollInCourseWithPayment = (courseId_,userId_) => {
    let courseId = new ObjectId(courseId_);
    let userId = new ObjectId(userId_)

    const enrollment = {
        course: courseId,
        user: userId,
    }

    const enrolledExam = new EnrolledExam(enrollment)
    enrolledExam.save((err,enExam) => {
        if(err){
            console.log(err,"Something went wrong while enrolling")
        }
            console.log(enExam,"Enrolled successfully")
    })    
}


exports.isEnrolled = (req,res) => {
    let courseId = new ObjectId(req.course._id);
    let userId = new ObjectId(req.profile._id)

    const query = {
        course: courseId,
        user: userId,
    }

    EnrolledExam.find(query)
    .exec((err, enExam) => {
        if(err){
            return res.status(400).json({
                error: "No course found in DB"
            })
        }
        res.json(enExam)
    })
}    

const getEnrolledLearner = async (courseId,userId) => {
    const query = {
        course: courseId,
        user: userId,
    }
    const enExam = await EnrolledExam.find(query).exec()
    return enExam
}

const checkSubmittedAnswers = async (examId,submittedAnswers) => {

    const query = {_id: new ObjectId(examId)}
    const options =  { _id: 0, answers:1 } 
    const ans = await Exam.findOne(query,options).exec() 
    if (submittedAnswers.length > 0){
        return submittedAnswers.every(answer => ans.answers.includes(answer))
    }else{
        return false
    }
    
}

exports.submitExam = async (req,res) => {

    let courseId = new ObjectId(req.course._id);
    let userId = new ObjectId(req.profile._id)

    let enrolledUser = await getEnrolledLearner(courseId,userId)

    if (enrolledUser.length > 0){

    const submittedAnswers = req.body
    let score = 0
    let totalScore = submittedAnswers.length

    const compeletedExam = await Promise.all(submittedAnswers.map( async (submittedAns) => {
        const checkIfCorrect = await checkSubmittedAnswers(submittedAns.id,submittedAns.choices) 
        if (checkIfCorrect){
            score += 1
        }
        return {
            course: courseId,
            takenBy: userId,
            exam:submittedAns.id,
            isCorrect:checkIfCorrect,
            answers:submittedAns.choices
        }        
    }))

    CompletedExam.insertMany(compeletedExam)
    .then(compeletedExamObjs => {
        console.log(compeletedExamObjs)
        console.log("answers added successfully")
    })
    .catch(err => {
        console.log("Something went wrong while submitting answers",err)
    })

    const currentScore = Math.round((score/totalScore) * 100)
    const isPass =  currentScore >= req.course.passPercentage

    EnrolledExam.updateOne(
        {_id:enrolledUser[0]._id},
        {$set: {coureseTaken: true,
                score: currentScore > enrolledUser[0].score ? currentScore : enrolledUser[0].score,
                pass: !enrolledUser[0].pass ? isPass : enrolledUser[0].pass
            }},
            (err, enUser) => {
            if(err){
                console.log("something went wrong while updating enrolled user ",err)
                }
            console.log("Enrolled user updated successfully",enUser)
        }
    )


    if(isPass){
        res.json({
            message:"You have passed the exam congrats",
            score:currentScore,
            isPass:true,
            attemptLeft: 3 - enrolledUser[0].frequency <= 0 ? 0 : 3 - enrolledUser[0].frequency
        })
    }else{
        res.json({
            message:"You have failed this exam!",
            score: currentScore ,
            isPass:false,
            attemptLeft: 3 - enrolledUser[0].frequency <= 0 ? 0 : 3 - enrolledUser[0].frequency
        })        
    }

    }else{
        res.status(400).json({
            status:false,
            message: "Please enroll to exam before taking it"
        })        
    }
}

const getResult = async (courseId_, userId_) => {
    let courseId = new ObjectId(courseId_);
    let userId = new ObjectId(userId_)

    const query = {
        course: courseId,
        user: userId,
    }

    const data = await EnrolledExam.find(query).exec()
    return data

}

exports.checkExamAttempts = async (req,res) => {
    const data = await getResult(req.course._id, req.profile._id)

    if(data.length > 0){
        if(data[0].frequency <= 3){
            res.json({
                status:true,
                message:`This is you attempt no - ${data[0].frequency} `
            })
        }else{
            res.json({
                status: false,
                error:`You have reached maximum number of attempts`
            })
        }
    }else{
        res.json({
            status: false,
            error:`User is not enrolled in this exam`
        })
    }
}

exports.checkIfLearnerCanEnroll = async (req,res) => {
    let courseId = new ObjectId(req.course._id);
    
    const data = await Exam.find({course: courseId}).exec()

    if(data.length > 0){
        return res.json({status:true})
    }
    return res.json({status:false})
}

exports.generateCertificate = async (req, res, next) => {

    const resultData = await getResult(req.course._id, req.profile._id)

    if(resultData.length > 0){
    
        var doc = new PDFDocument({  
                    bufferPages: true,
                    layout: 'landscape',
                    size: 'A4'
                });
        
        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
        
            let pdfData = Buffer.concat(buffers);
            res.writeHead(200, {
            'Content-Length': Buffer.byteLength(pdfData),
            'Content-Type': 'application/pdf',
            'Content-disposition': 'attachment;filename=test.pdf',})
            .end(pdfData);
        
        });
        
        // Helper to move to next line
        function jumpLine(doc, lines) {
            for (let index = 0; index < lines; index++) {
            doc.moveDown();
            }
        }
        
        doc.pipe(fs.createWriteStream('output.pdf'));
        
        doc.rect(0, 0, doc.page.width, doc.page.height).fill('#fff');
        
        doc.fontSize(10);
        
        // Margin
        const distanceMargin = 18;
        
        doc
            .fillAndStroke('#0e8cc3')
            .lineWidth(20)
            .lineJoin('round')
            .rect(
            distanceMargin,
            distanceMargin,
            doc.page.width - distanceMargin * 2,
            doc.page.height - distanceMargin * 2,
            )
            .stroke();
        
        // Header
        const maxWidth = 140;
        const maxHeight = 70;
        
        doc.image(__dirname+'/assets/winners.png', doc.page.width / 2 - maxWidth / 2, 60, {
            fit: [maxWidth, maxHeight],
            align: 'center',
        });
        
        jumpLine(doc, 5)
        
        doc
            .font(__dirname+'/fonts/NotoSansJP-Light.otf')
            .fontSize(10)
            .fill('#021c27')
            .text('SLAT for simple learning', {
            align: 'center',
            });
        
        jumpLine(doc, 2)
        
        // Content
        doc
            .font(__dirname+'/fonts/NotoSansJP-Regular.otf')
            .fontSize(16)
            .fill('#021c27')
            .text('CERTIFICATE OF COMPLETION', {
            align: 'center',
            });
        
        jumpLine(doc, 1)
        
        doc
            .font(__dirname+'/fonts/NotoSansJP-Light.otf')
            .fontSize(10)
            .fill('#021c27')
            .text('Present to', {
            align: 'center',
            });
        
        jumpLine(doc, 2)
        
        doc
            .font(__dirname+'/fonts/NotoSansJP-Bold.otf')
            .fontSize(24)
            .fill('#021c27')
            .text(`${req.profile.name}`, {
            align: 'center',
            });
        
        jumpLine(doc, 1)
        
        doc
            .font(__dirname+'/fonts/NotoSansJP-Light.otf')
            .fontSize(10)
            .fill('#021c27')
            .text(`Successfully completed ${req.course.name} with ${resultData[0].score} %`, {
            align: 'center',
            });
        
        jumpLine(doc, 7)
        
        doc.lineWidth(1);
        
        // Signatures
        const lineSize = 174;
        const signatureHeight = 390;
        
        doc.fillAndStroke('#021c27');
        doc.strokeOpacity(0.2);
        
        const startLine1 = 128;
        const endLine1 = 128 + lineSize;
        doc
            .moveTo(startLine1, signatureHeight)
            .lineTo(endLine1, signatureHeight)
            .stroke();
        
        const startLine2 = endLine1 + 32;
        const endLine2 = startLine2 + lineSize;
        doc
            .moveTo(startLine2, signatureHeight)
            .lineTo(endLine2, signatureHeight)
            .stroke();
        
        const startLine3 = endLine2 + 32;
        const endLine3 = startLine3 + lineSize;
        doc
            .moveTo(startLine3, signatureHeight)
            .lineTo(endLine3, signatureHeight)
            .stroke();
        
        doc
            .font(__dirname+'/fonts/NotoSansJP-Bold.otf')
            .fontSize(10)
            .fill('#021c27')
            .text('Krish Nayak', startLine1, signatureHeight + 10, {
            columns: 1,
            columnGap: 0,
            height: 40,
            width: lineSize,
            align: 'center',
            });
        
        doc
            .font(__dirname+'/fonts/NotoSansJP-Light.otf')
            .fontSize(10)
            .fill('#021c27')
            .text('Associate Professor', startLine1, signatureHeight + 25, {
            columns: 1,
            columnGap: 0,
            height: 40,
            width: lineSize,
            align: 'center',
            });
        
        doc
            .font(__dirname+'/fonts/NotoSansJP-Bold.otf')
            .fontSize(10)
            .fill('#021c27')
            .text(`${req.profile.name}`, startLine2, signatureHeight + 10, {
            columns: 1,
            columnGap: 0,
            height: 40,
            width: lineSize,
            align: 'center',
            });
        
        doc
            .font(__dirname+'/fonts/NotoSansJP-Light.otf')
            .fontSize(10)
            .fill('#021c27')
            .text('Student', startLine2, signatureHeight + 25, {
            columns: 1,
            columnGap: 0,
            height: 40,
            width: lineSize,
            align: 'center',
            });
        
        doc
            .font(__dirname+'/fonts/NotoSansJP-Bold.otf')
            .fontSize(10)
            .fill('#021c27')
            .text('Sudhanshu', startLine3, signatureHeight + 10, {
            columns: 1,
            columnGap: 0,
            height: 40,
            width: lineSize,
            align: 'center',
            });
        
        doc
            .font(__dirname+'/fonts/NotoSansJP-Light.otf')
            .fontSize(10)
            .fill('#021c27')
            .text('Director', startLine3, signatureHeight + 25, {
            columns: 1,
            columnGap: 0,
            height: 40,
            width: lineSize,
            align: 'center',
            });
        
        jumpLine(doc, 4);
                
        doc.end();
    }
}

