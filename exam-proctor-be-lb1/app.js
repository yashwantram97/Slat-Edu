require('dotenv').config()

const express = require("express")
const mongoose = require("mongoose")
var cors = require("cors")
var cookieParser = require("cookie-parser")
var bodyParser = require("body-parser")

const authRoutes = require("./routes/auth")
const categoryRoutes = require("./routes/category")
const courseRoutes = require("./routes/course")
const examRoutes = require("./routes/exam")
const faceRoutes = require("./routes/face")
const contentRoutes = require("./routes/content")
const paymentRoutes = require("./routes/payment")
const profileRoutes = require("./routes/profile")

const app = express()

mongoose.connect(process.env.DATABASE,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log("DB CONNECTED")
})


app.use(cookieParser())
app.use(cors())

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use('/api', authRoutes)
app.use('/api', categoryRoutes)
app.use('/api',courseRoutes)
app.use('/api',examRoutes)
app.use('/api',faceRoutes)
app.use('/api',contentRoutes)
app.use('/api',paymentRoutes)
app.use('/api',profileRoutes)


const port = process.env.PORT

app.listen(port, () => {
    console.log(`app is running in port ${port}`)
})