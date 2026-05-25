const multer = require('multer');
const path = require('path');
const fs = require('fs');
// const rest = require('axios').default;
const pdf = require('pdf-parse');
const miner = require('text-miner');
const { addMetadata, createMetadata } = require('../controllers/meta-controller');


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
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
          fs.mkdirSync(path.join(__dirname, '../files/'), { recursive: true });
          // Set the destination folder where files will be uploaded
          cb(null, path.join(__dirname, '../files/'));
        },
        filename: (req, file, cb) => {
          // Keep the original file name
          req.savedFileName = file.originalname;
          cb(null, file.originalname);  // This will save the file with its original name
        }
      }),
    fileFilter: (req, file, cb) => {
        sanitizeFile(file, cb);
    }
});

const extractMiddleware = async (req, res, next) => {
    const file = req.savedFileName;

    if (!file) {
        return res.status(400).json({ message: 'File not found' });
    }

    try {

        console.log(path.join(__dirname, '../files/') + file);
        const dataBuffer = fs.readFileSync(path.join(__dirname, '../files/') + file);
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

        // console.log(terms.nTerms);

        const keywords = terms.findFreqTerms(100);

        const result = await createMetadata({ fileName: file, uploader: req.uploader, keywords });

        if (!result) {
            fs.rmSync(path.join(__dirname, '../files/') + file);
            return res.status(400).json({ message: 'Metadata uploading failed.' });
        }
        
        res.status(200).json({ message: 'File sent.', fileName: file.originalname, keywords: keywords });
    } catch (err) {
        console.error(err);
        return res.status(err.response.status).json({ message: err.response.data.message });
    }
};

exports.extract = extractMiddleware;
exports.uploader = uploader;