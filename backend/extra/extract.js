const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const pdf = require('pdf-parse');
const miner = require('text-miner');
const dotenv = require('dotenv');
const prometheus = require('prom-client');

const utils = require('./utils');
const { format } = require('url');
const { send, connectQueue } = require('./queue-util');

dotenv.config();
const host = process.env.HOST;
const port = process.env.PORT;

const metricRegistry = new prometheus.Registry();
metricRegistry.setDefaultLabels({
    app: 'pdfshare-extracting-service'
});
prometheus.collectDefaultMetrics({ metricRegistry });

const uploader = multer({ storage: multer.diskStorage({ 
    destination: (req, file, cb) => {
        cb(null, 'files');
    },
    filename: (req, file, cb) => {
        const savedFileName = file.originalname;
        req.savedFileName = savedFileName;
        cb(null, savedFileName);
    }
})});

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

const downloadFile = (req, res, next) => {
    const file = req.query.file;

    const filePath = `./files/${file}`;
    res.download(filePath, (err) => {
        if (err) {
            console.log(err);
        }
    });
}

const extract = express();
extract.use(cors());
extract.use(bodyParser.json());
extract.use(utils.apiLogger);
extract.post('/api/extra/extract/file', uploader.single('file'), extractMiddleware);
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