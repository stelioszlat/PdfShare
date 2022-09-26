const express = require('express');
const multer = require('multer');
const fs = require('fs');
const rest = require('axios').default;
const cache = require('../shared/redis-util');
const pdf = require('pdf-parse');

const router = express.Router();

const uploader = multer({ storage: multer.diskStorage({ 
    destination: (req, file, cb) => {
        cb(null, 'files');                              // 'files' should be replaced with configurable path
    },
    filename: (req, file, cb) => {
        const savedFileName = Date.now() + "_" + file.originalname;
        req.savedFileName = savedFileName;
        cb(null, savedFileName);
    }
})});

// /api/extracting
router.post('/file', uploader.single('file'), async (req, res, next) => {
    // get file
    const file = req.file;
    const dataBuffer = fs.readFileSync(file.path);

    try {
       console.log(file);
       // extract metadata 
        pdf(dataBuffer).then(data => {

            console.log(data.metadata);

        }).catch(err => { return next(err) });
       // send metadata and then store metadata to the cache by metadata id
       const result = await rest.post('http://localhost:8080/api/metadata/file/new', {fileName: file.originalname});

       console.log(result);

       res.status(200).json({ message: 'File sent.', fileName: file.originalname })
    } catch (err) {
        return next(err);
    }
});


module.exports = router;