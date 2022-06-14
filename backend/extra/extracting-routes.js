const express = require('express');
const multer = require('multer');
const fs = require('fs');
const rest = require('axios').default;
// const pdf = require('pdf-parse');

const router = express.Router();
const uploader = multer({ storage: multer.memoryStorage() });

// /api/extracting
router.post('/extract', uploader.single('file'), (req, res, next) => {
    // get file
    const file = req.file;
    try {
        // post a method to tika-server
        // rest.put("http://localhost:8082/tika", file)
        // .then(response => {
            // console.log(response.headers);
        // });
    } catch (err) {
        return next(err);
    }
});

router.get('/data', (req, res, next) => {
    // get from redis else mongo
    res.status(501).json({message: "Not available yet"});
});


module.exports = router;