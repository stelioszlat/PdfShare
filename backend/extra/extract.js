const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const rest = require('axios').default;
const pdf = require('pdf-parse');
const dotenv = require('dotenv');

const utils = require('./utils');

dotenv.config();
const host = process.env.HOST;
const port = process.env.PORT;

const uploader = multer({ storage: multer.diskStorage({ 
    destination: (req, file, cb) => {
        cb(null, process.env.PATH);
    },
    filename: (req, file, cb) => {
        const savedFileName = Date.now() + "_" + file.originalname;
        req.savedFileName = savedFileName;
        cb(null, savedFileName);
    }
})});

const extract = express();
extract.use(cors());
extract.use(bodyParser.json());
extract.use(utils.apiLogger);
extract.use('/api/extract/file',  uploader.single('file'), async (req, res, next) => {

    const file = req.file;
    const dataBuffer = fs.readFileSync(file.path);

    try {
       console.log(file);
       // extract metadata 
        pdf(dataBuffer).then(data => {

            console.log(data.metadata);

        }).catch(err => { return next(err) });

       // send metadata and then store metadata to the cache by metadata id
       const result = await rest.post(`http://${process.env.BACKEND}/api/metadata/file/new`, {fileName: file.originalname});

       console.log(result);

       res.status(200).json({ message: 'File sent.', fileName: file.originalname })
    } catch (err) {
        return next(err);
    }
});

extract.listen(port, host, () => {
    console.log(`Running extracting service on ${host}:${port}`);
});

// Run service on host:port

// Post a file on https://extract.pdfshare.io/api/extracting/extract

// Extract metadata from the file

// Send metadata to https://pdfshare.io/api/metadata/new
// this url should be dynamically passed into the service


