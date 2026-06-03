const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
// const multers3 = require('multer-s3');
const fs = require('fs');
const pdf = require('pdf-parse');
const miner = require('text-miner');
const dotenv = require('dotenv');
const prom = require('prom-client');

const utils = require('./utils');
const { format } = require('url');
const { send, connectQueue } = require('./queue-util');
const path = require('path');

const awsS3 = require('@aws-sdk/client-s3');

dotenv.config();
const host = process.env.HOST;
const port = process.env.PORT;

const register = new prom.Registry();
prom.collectDefaultMetrics({ register });

const httpRequestDuration = new prom.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

const httpRequestCounter = new prom.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestCounter);

const s3 = new awsS3.S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
});

const sanitizeFile = (file, cb) => {
    const fileExtensions = ['.pdf'];

    const isAllowed = fileExtensions.includes(path.extname(file.originalname.toLowerCase()));
    console.log("File is" + (isAllowed ? " " : "not ") + "allowed")

    if (isAllowed) {
        return cb(null, true);
    } else {
        return cb("File type not allowed!");
    }
}

const uploader = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        sanitizeFile(file, cb);
    }
});

const extractMiddleware = async (req, res, next) => {
    const file = req.file;
    console.log(file)
    // const token = req.get('Authorization').split(' ')[0];

    if (!file) {
        return res.status(400).json({ message: 'File not found' });
    }

    try {

        const dataBuffer = file.buffer;

        if (!dataBuffer) {
            return res.status(400).json({ message: 'Failed to process file.' });
        }

        const data = await pdf(dataBuffer);

        let cleanText = data.text.replace(/^[_-\w]/gi, ' ');
        cleanText = cleanText.replace(/[\n\r\t\f\b]/g, " ");
        cleanText = cleanText.replace(/[\x00-\x1F\x7F-\x9F]/g, "");
        cleanText = cleanText.replace(/\s+/g, " ");
        cleanText = cleanText.replace(/[^a-zA-Z ]/g, " ");

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
        const keywords = terms.findFreqTerms(100).filter(term => {
            const isPureText = /^[a-zA-Z]+$/.test(term.word);
    
            return isPureText && term.word.length > 4;
        });

        send({fileName: file.originalname, uploader: 'unknown', keywords: keywords });

        console.log('Sent file: ' + file.originalname);

        await s3.send(new awsS3.PutObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: file.originalname,
            Body: file.buffer,
        }));
        
        return res.status(200).json({ message: 'File sent.', fileName: file.originalname, keywords: keywords });
    } catch (err) {
        console.error(err);
        return res.status(409).json({ message: 'Bad Request' });
    }
};

const downloadFile = async (req, res, next) => {
    const file = req.query.file;

    const command = new awsS3.GetObjectCommand({
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
extract.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration.labels(req.method, req.route?.path || req.path, res.statusCode).observe(duration);
    httpRequestCounter.labels(req.method, req.route?.path || req.path, res.statusCode).inc();
  });
  
  next();
});
extract.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
extract.use(cors());
extract.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Methods', "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
extract.use(bodyParser.json());
extract.use(utils.apiLogger);
// extract.post('/api/extra/extract/file', uploader.single('file'), extractMiddleware);
extract.post('/api/extra/upload', uploader.single('file'), extractMiddleware);
extract.get('/api/extra/download', downloadFile);
extract.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: err.message});
});

connectQueue();

extract.listen(port, host, () => {
    console.log(`Running extracting service on ${host}:${port}`);
});

exports.extract = extractMiddleware;
exports.uploader = uploader;