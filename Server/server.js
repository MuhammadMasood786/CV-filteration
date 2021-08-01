const express = require('express')
const connectDB = require('./config/db')
const KEYS = require("./key")
const path = require('path')
const app = express()
const cors = require('cors')



connectDB()

app.use(cors({ origin: true }));

app.use(express.json({ extended: false }))
app.use("/files",express.static('public'));


// Define Routes 
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/user', require('./routes/api/user'))
app.use('/api/posts', require('./routes/api/posts'))
app.use('/api/profile', require('./routes/api/profile'))

// if (KEYS.NODE_ENV === 'production') {
//     app.use(express.static('client/build'))

//     app.get('*', (req, res) => {
//         res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
//         console.log(path)
//     })
// }




const PORT = process.env.PORT | 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
