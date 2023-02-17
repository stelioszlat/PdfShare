const multer = require('multer');
const fs = require('fs');
const rest = require('axios').default;
const pdf = require('pdf-parse');
const miner = require('text-miner');


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
    const token = req.get('Authorization').split(' ')[0];

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

        // console.log(terms.nTerms);

        const keywords = terms.findFreqTerms(100);

        // send metadata and then store metadata to the cache by metadata id
        const result = await rest('http://127.0.0.1:8080/api/metadata/file/new', {
            fileName: file.originalname,
            uploader: 'stelioszlat',
            keywords: keywords
        }, {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        });

        console.log('Result: ' + result);

        if (!result) {
            return res.status(400).json({ message: 'Metadata uploading failed.' });
        }
        
        res.status(200).json({ message: 'File sent.', fileName: file.originalname, keywords: keywords });
    } catch (err) {
        return res.status(err.response.status).json({ message: err.response.data.message });
    }
};

exports.extract = extractMiddleware;
exports.uploader = uploader;