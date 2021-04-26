
const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const Metadata = require('../models/metadata');
// const uuid = require('uuid/dist/v4');


var localUri = "mongodb://localhost:27017/metadata";
var atlasUri = "mongodb+srv://stelioszlat:ntERINguANdweSc@pdfcluster.0iyo1.mongodb.net/metadata?retryWrites=true&w=majority"

const addMetadata = async (req, res, next) =>{
    // validate data and store them
    try{
        await mongoose.connect(
            atlasUri,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
    }
    catch(err){
        console.log({error: err});
        return next(new HttpError(err, 500));
    }

    const {fileName, uploader, dateAdded, dateModified, keywords} = req.body; 

    const addedMeta = Metadata({
        // id: uuid(),
        fileName: fileName,
        uploader: uploader,
        dateAdded: dateAdded,
        dateModified: dateModified,
        keywords: keywords
    });

    try{
        await addedMeta.save();
    }
    catch(err){
        console.log(err);
        return next(err);
    }

    console.log( {addedMeta});

    res.status(200).json({message: 'Success'});
};

// const updateMetadata = (req, res, next) =>{
//     console.log('Routing to metadata update works');
//     res.status(200).json({message: 'Success'});
// }

exports.addMetadata = addMetadata;
// exports.updateMetadata = updateMetadata;