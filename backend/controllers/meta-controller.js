
const Metadata = require('../models/metadata');
// const { uuid } = require('uuid/dist/v4');

exports.addMetadata = async (req, res, next) =>{

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

    console.log({addedMeta});

    res.status(200).json({message: 'Success'});
};

exports.getMetadata = async (req, res, next) => {

    try{
        const result = await Metadata.find();
        console.log('requested metadata: ', result);
        res.status(200).json(result);
    }
    catch(err) {
        return next(err);
    }
}

exports.getMetadataById = async (req, res, next) => {
    
    const fileId = req.params.fid;

    try{
        const result = await Metadata.findById(fileId);
        console.log("requested metadata: ", result);
        res.status(200).json(result);
    }
    catch(err){
        return next(err);
    }
}