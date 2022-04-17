
const Metadata = require('../models/metadata');
const cache = require('../cache/redis-util');

exports.addMetadata = async (req, res, next) =>{

    const {fileName, uploader, dateAdded, dateModified, keywords} = req.body;

    const addedMeta = Metadata({
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

    res.status(201).json({message: 'Success'});
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

exports.updateMetadataById = async (req, res, next) => {

    const fileId = req.params.fid;

    try {

        const file = await Metadata.findById(fileId);

        if (!file) {
            return next('Could not find file for update.');
        }

        if (file.fileName === req.body.fileName) {
            res.status(409);
            return next('File name cannot be updated.');
        }

        const result = await Metadata.findByIdAndUpdate(fileId, {
            ...req.body
        });

        res.status(200).json({message: "Updated file.", file: result});

    } catch(err) {
        return next(err);
    }
}

exports.deleteMetadataById = async (req, res, next) => {

    const fileId = req.params.fid;

    try {

        const file = await Metadata.findById(fileId);

        if (!file) {
            return next('Could not find file for delete');
        }

        const result = await Metadata.findByIdAndDelete(fileId);

        res.status(200).json({message: "Deleted file.", file: result});

    } catch(err) {
        return next(err);
    }
}