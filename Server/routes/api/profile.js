const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const checkObjectId = require('../../middleware/checkObjectId');

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { dirname } = require('path');
const SearchInFile = require('search-in-file')
const PDFParser = require("pdf2json");
const pdfParse = require('pdf-parse');
const { findOneAndUpdate } = require('../../models/Post');


const storageEngine = multer.diskStorage({
    destination: (req, res, callback) => {
        callback(null, './public')
    },
    filename: (req, file, callback) => {
        callback(null, file.filename + '-' + Date.now() + path.extname(file.originalname))
    }
})

const filefilter = (freq, file, callback) => {
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
    fileFilter: filefilter
});


const obj = (req, res) => {
    upload(req, res, () => {
        const files = req.files
        console.log("Fun", files)
    })
}

// auth 
router.post('/create-profile', upload.single('myFile'), async (req, res) => {
    // const errors = validationResult(req);
    // if (!error.isEmpty()) {
    //     return res.status(400).json({ errors: errors.array() })
    // }
    debugger
    try {
        const { name, email, gitLink, linkedinLink, shortBio } = req.body
        console.log("req body====>", req.body)
        console.log("req ====>", req.file)
        const meta_data = req.file
        const profile = new Profile({
            // user: req.user.id,
            name,
            email,
            gitLink,
            linkedinLink,
            shortBio,
            meta_data
        })
        const profileSave = await profile.save()

        res.status(200).json({ profile: profileSave })

    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Error in Profile');
    }
})

const jsonFormator = []
router.get('/getfiles', async (req, res) => {
    try {
        const FetchAllData = await Profile.find()
        res.status(200)
            .json({ fetchAll: FetchAllData })
    }
    catch {
        res.status(404)
            .json({ fMsg: 'Something went wrong' })
    }

})

router.get('/searchtext', async (req, res) => {
    const files = fs.readdirSync('public')
    const searchText = req.query.searchingText
    var abc = []
    for (let file of files) {
        const abcd = SearchTextInFiles(file, searchText)
        const data = await abcd
        abc = data
    }
    res.status(200).json({ text: abc })
    abc.length = 0
})

const result = [];
const SearchTextInFiles = async (file, text) => {
    return new Promise(async (resolve) => {
        const regEx = new RegExp(text, "i")
        fs.readFile(`public/${file}`, async (err, contents) => {
            let arrText = await pdfParse(contents)
            let lines = arrText.text.toString().split("\n")
            lines.forEach(line => {
                if (line && line.search(regEx) >= 0) {
                    result.push({ Lines: line, FileName: file })
                }
            })
            await resolve(result)
        })
    })
}

module.exports = router

