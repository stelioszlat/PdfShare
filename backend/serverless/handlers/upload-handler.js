const awsS3 = require('@aws-sdk/client-s3');
const dotenv = require('dotenv');

dotenv.config();

const s3 = new awsS3.S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    region: 'eu-north-1',
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
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
          // Set the destination folder where files will be uploaded
          cb(null, 'files/');
        },
        filename: (req, file, cb) => {
          // Keep the original file name
          cb(null, file.originalname);  // This will save the file with its original name
        }
      }),
    fileFilter: (req, file, cb) => {
        sanitizeFile(file, cb);
    }
});

const extract = async (req, res, next) => {
    const file = req.file;
    console.log(file)
    // const token = req.get('Authorization').split(' ')[0];

    if (!file) {
        return res.status(400).json({ message: 'File not found' });
    }

    try {

        const dataBuffer = fs.readFileSync('./files/' + file.originalname);

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

exports.handler = function (event, context, callback) {
    const body = event.body;

    s3.putObject({
        Bucket: process.env.S3_BUCKET,
        Key: 'file_name',
        Body: body,
    }).then(response => {
        callback(null, {
            statusCode: 200,
            body: {
                message: 'File uploaded'
            }
        })
    }).catch(err => {
        console.log(err);
    });
}