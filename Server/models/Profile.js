const mongoose = require("mongoose");


const ProfileSchema = new mongoose.Schema({
    // user: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'user'
    // }],
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
        unique: true,
    },
    gitLink: {
        type: String,
        // required: true
    },
    linkedinLink: {
        type: String,
        // required: true
    },
    shortBio: {
        type: String,
        required: true
    },
     meta_data: {
    },
})

module.exports = mongoose.model('profile', ProfileSchema)