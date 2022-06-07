var mongoose = require("mongoose")

var categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLegth: 32,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        trim: true
    }
    },
    {timestamps:true}
)

module.exports = mongoose.model("Category",categorySchema)