const express = require('express');
const multer = require('multer');

const router = express.Router();
const uploader = multer({ storage: multer.memoryStorage() });

// /api/extracting
router.post('/extract', uploader.single('.pdf'), (req, res, next) => {
    // get file
    try {
        const options = {
            formData: {
                'upload': req.file.buffer
            },
            headers: {
                authorization: req.token,
                'Content-type': 'multipart/form-data'
            },
            json: true
        }

        
    } catch (err) {
        
    }

    // extract metadata etc...

    // send to mongo -> elastic -> redis
    res.status(501).json({message: "Not available yet"});
});

router.get('/data', (req, res, next) => {
    // get from redis else mongo
    res.status(501).json({message: "Not available yet"});
});


module.exports = router;