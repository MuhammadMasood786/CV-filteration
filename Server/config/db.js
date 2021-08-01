const mongoose = require('mongoose');
// const dotenv = require('dotenv');
const KEYS = require("../key")

// dotenv.config()


const connectDB = async () => {

    try {
        await mongoose.connect(KEYS.MONGODB_SECRET_KEY, {
            useUnifiedTopology:true,
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
           
        }).then(
           ()=>console.log("ConnectDB") 
        )
        
    } catch (error) {
        console.log(error.message)
        process.exit(1)

    }
}

module.exports = connectDB;