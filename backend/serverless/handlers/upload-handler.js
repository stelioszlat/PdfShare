const awsS3 = require('@aws-sdk/client-s3');
const dotenv = require('dotenv');
const { createMetadata } = require('./metadata-handler');
const parser = require('lambda-multipart-parser');
const pdf = require('pdf-parse');
const miner = require('text-miner');
const path = require('path');

dotenv.config();

const s3 = new awsS3.S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    region: 'eu-north-1',
});

const isFileAllowed = (file) => {
    const fileExtensions = ['.pdf'];
    return fileExtensions.includes(path.extname(file.filename.toLowerCase()));
}

const extract = async (file) => {

    const dataBuffer = file.content ? Buffer.from(file.content, 'base64') : null;
    
    try {
        if (!dataBuffer) {
            throw new Error('File does not exist.');
        }

        const data = await pdf(dataBuffer);
        data.text.replace(/^[_-\w]/gi, ' ');

        let cleanText = data.text.replace(/^[_-\w]/gi, ' ');
        cleanText = cleanText.replace(/[\n\r\t\f\b]/g, " ");
        cleanText = cleanText.replace(/[\x00-\x1F\x7F-\x9F]/g, "");
        cleanText = cleanText.replace(/\s+/g, " ");
        cleanText = cleanText.replace(/[^a-zA-Z ]/g, " ");

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

        const savedFile = await createMetadata({ fileName: file.filename, uploader: 'unknown', keywords: keywords });

        if (!savedFile) {
            console.error('Could not create metadata for file: ' + file.filename);
            return false;
        }
        console.log('Sent file: ' + savedFile.fileName);
        
        return savedFile;
    } catch (err) {
        console.error(err);
        return false
    }
};

exports.upload = async function (event, context, callback) {
    try {
        const result = await parser.parse(event);
        const uploadedFile = result.files.find(f => f.fieldname === 'file');

        if (!uploadedFile) {
            return callback(null, {
                statusCode: 400,
                body: JSON.stringify({ message: 'No file uploaded.' })
            });
        }
        
        if (!isFileAllowed(uploadedFile)) {
            return callback(null, {
                statusCode: 400,
                body: JSON.stringify({ message: 'File type not allowed.' })
            });
        }

        const file = await extract(uploadedFile);

        if (!file) {
            return callback(null, {
                statusCode: 500,
                body: JSON.stringify({ message: 'Could not process file.' })
            })
        }

        await s3.putObject({
            Bucket: process.env.S3_BUCKET,
            Key: uploadedFile.filename,
            Body: body,
        });

        return callback(null, {
            statusCode: 200,
            body: JSON.stringify({ message: 'File sent.' })
        });
    } catch (err) {
        console.error(err);
        return callback(null, {
            statusCode: 500,
            body: JSON.stringify({ message: 'Could not send file.' })
        });
    }
}