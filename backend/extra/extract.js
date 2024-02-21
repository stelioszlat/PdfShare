const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const multers3 = require('multer-s3');
const fs = require('fs');
const pdf = require('pdf-parse');
const miner = require('text-miner');
const dotenv = require('dotenv');
const prometheus = require('prom-client');

const utils = require('./utils');
const { format } = require('url');
const { send, connectQueue } = require('./queue-util');
const path = require('path');

const aws = require('@aws-sdk/client-s3');

dotenv.config();
const host = process.env.HOST;
const port = process.env.PORT;

const s3 = new aws.S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    region: process.env.AWS_REGION,
});

const s3Storage = multers3({
    s3: s3,
    bucket: process.env.S3_BUCKET,
    key: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const metricRegistry = new prometheus.Registry();
metricRegistry.setDefaultLabels({
    app: 'pdfshare-extracting-service'
});
prometheus.collectDefaultMetrics({ metricRegistry });


const sanitizeFile = (file, cb) => {
    const fileExtensions = ['.pdf'];

    const isAllowed = fileExtensions.includes(path.extname(file.originalname.toLowerCase()));

    if (isAllowed) {
        return cb(null, true);
    } else {
        return cb("File type not allowed!");
    }
}

const uploader = multer({ 
    storage: s3Storage,
    fileFilter: (req, file, cb) => {
        sanitizeFile(file, cb);
    }
});

const extractMiddleware = async (req, res, next) => {
    const file = req.savedFileName;
    console.log(file);
    // const token = req.get('Authorization').split(' ')[0];

    if (!file) {
        return res.status(400).json({ message: 'File not found' });
    }

    try {

        const dataBuffer = fs.readFileSync('./files/' + file);

        if (!dataBuffer) {
            return res.status(404).json({ message: 'File does not exist.' });
        }

        const data = await pdf(dataBuffer);

        data.text.replace(/^[_-\w]/gi, ' ');

        console.log('Info ' + data.info);
        console.log('Metadata ' + data.metadata);
        console.log('Num pages ' + data.numpages);
        console.log('Num render ' + data.numrender);
        console.log('Version ' + data.version);

        const content = miner.Corpus(data.text);
        content.removeNewlines();
        content.removeInterpunctuation();
        content.removeWords(miner.STOPWORDS.EN, true);
        content.removeDigits();
        content.removeInvalidCharacters();
        content.toLower();
        content.trim();

        const terms = new miner.DocumentTermMatrix(content);

        const keywords = terms.findFreqTerms(100);

        send({fileName: file, uploader: 'stelioszlat', keywords: keywords });

        console.log('Sent file: ' + file);
        
        return res.status(200).json({ message: 'File sent.', fileName: file, keywords: keywords });
    } catch (err) {
        console.error(err);
        return res.status(409).json({ message: 'Bad Request' });
    }
};

const uploadFile = (req, res, next) => {
    return res.status(200).json({ message: req.file.originalname + ' uploaded' });
}

const downloadFile = async (req, res, next) => {
    const file = req.query.file;

    const command = new aws.GetObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: file
    });
    
    try {
        const response = await s3.send(command);

        res.attachment(file);
        response.Body.pipe(res);

    } catch (err) {
        return next(err);
    }
}

const extract = express();
extract.use(cors());
extract.use(bodyParser.json());
extract.use(utils.apiLogger);
extract.post('/api/extra/extract/file', uploader.single('file'), extractMiddleware);
extract.post('/api/extra/upload', uploader.single('file'), uploadFile);
extract.get('/api/extra/download', downloadFile);
extract.get('/metrics', async (req, res, next) => {
    const metrics = await metricRegistry.metrics();
    return res.send(metrics);
});
extract.use((err, req, res, next) => {
    res.status(500).json({ message: err.message});
});

connectQueue();

extract.listen(port, host, () => {
    console.log(`Running extracting service on ${host}:${port}`);
});

exports.extract = extractMiddleware;
exports.uploader = uploader;