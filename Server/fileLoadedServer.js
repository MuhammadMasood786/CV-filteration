const express = require('express')
const cors = require('cors')
const path = require('path')
const KEYS = require("./keys");
const mongoose = require('mongoose');
const File = require('./models/fileupload')
const multer = require('multer');

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

mongoose.connect(KEYS.MONGODB_SECRET_KEY_FOR_FILE, {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true
})
    .then(
        () => console.log("Connected")
    )
    .catch(
        (err) => console.log("Error", err)
    )


const storageEngine = multer.diskStorage({
    destination: (req, res, callback) => {
        callback(null, './public/')
    },
    filename: (req, file, callback) => {
        callback(
            null,
            file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        )
    }
})

const fileFilter = (freq, file, callback) => {
    let pattern = /^.*\.(doc|DOC|pdf|PDF)$/

    if (pattern.test(path.extname(file.originalname))) {
        callback(null, true)
    }
    else {
        callback('Error:not valid file')
    }
}

const upload = multer({
    storage: storageEngine,
    fileFilter: fileFilter,
}).single('myFile');


const obj = (req, res) => {
    upload(req, res, () => {
        debugger;
        console.log("Request ---", req.body);
        console.log("Request ---", req.route);
        console.log("Request file ---", req.file);
        const file = new File();
        file.meta_data = req.file;
        file.save().then(() => {
            res.send(req.body)
        })
        /*Now do where ever you want to do*/
    });
}

const fs = require('fs')
const pdfParse = require('pdf-parse')

const readPdf = async (uri) => {
    const buffer = fs.readFileSync(uri);
    try {
        const data = await pdfParse(buffer)
        // console.log("Content", data)
        let arrText = data.text.split(' ')
        arrText.filter((x) => {
            if (x == "skill" || 'Skill') {
                console.log(x)
            }
        })
        // console.log(arrText);
        // console.log("Content", data.text)

    }
    catch (error) {
        throw new Error(error)
    }
}


const PdfFile = './public/myFile-1619380070150.pdf'
readPdf(PdfFile)


app.post('/upload', obj, (req, res) => {
    console.log(req.files)
    res.json(req.file).status(200)
})

app.listen(PORT, () => console.log(`Server running on port:${PORT}`))