
const mongoose = require('mongoose');
const Metadata = require('../models/metadata');
const User = require('../models/user');
const cache = require('../util/redis-util');
const index = require('../util/elastic-util');

exports.addMetadata = async (req, res, next) => {

    const {fileName, uploader, keywords} = req.body;

    try {
        const file = this.createMetadata({fileName, uploader, keywords});

        if (!file) {
            return res.status(400).json({ message: 'File name is required' });
        }

        return res.status(200).json({file});
    } catch (err) {
        return next(err);
    }
};

exports.createMetadata = async (data) => {
    if (!data.fileName) {
        return false;
    }

    const addedMeta = new Metadata({
        fileName: data.fileName,
        uploader: data.uploader,
        timesQueried: 0,
        timesModified: 0,
        version: 1,
        keywords: data.keywords
    });

    try {
        const file = await addedMeta.save();

        await cache.set(file._id, file);
        await cache.set(data.fileName, file);

        console.log('Added new file: ' + file.fileName);

        return file;
    }
    catch(err){
        await cache.delete(file._id);
        await cache.delete(data.fileName);

        return false;
    }
}

exports.getMetadata = async (req, res, next) => {
    // need to add pagination
    let {
        page,
        limit
    } = req.query;
    // search cache first
    
    try {
        const files = await Metadata.find({}, { keywords: 0, __v: 0}).limit(+limit).skip((+page - 1) * +limit);

        let count = await Metadata.countDocuments();
        
        if (!files) {
            return res.status(404).json({ message: 'Could not find any files.' });
        }

        res.status(200).json({
            page,
            limit,
            count,
            currentPage: Math.ceil(count / limit),
            files
        });
    }
    catch(err) {
        return next(err);
    }
}

exports.getMetadataByUserId = async (req, res, next) => {

    const userId = req.params.uid;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'File id is not valid' });
    }

    try {

        const user = await User.findById(userId, { keywords: 0, __v: 0});

        if (!user) {
            return res.status(404).json({ message: 'Could not find user' });
        }

        const files = await Metadata.find({
            uploader: user.username
        }, { keywords: 0 });

        if (!files) {
            return res.status(404).json({ message: 'Could not find files' });
        }

        return res.status(200).json({ files });

    }
    catch (err) {
        return next(err);
    }
}

exports.getMetadataById = async (req, res, next) => {
    
    const fileId = req.params.fid;

    try {
        let file = await cache.get(fileId);

        if (file) {
            return res.status(200).json({file});
        }
        
        file = await Metadata.findById(fileId);

        if (!file) {
            return res.status(404).json({ message: 'Could not find file.' });
        }

        await cache.set(file._id, file);
        await cache.set(file.fileName, file);

        res.status(200).json({file});
    }
    catch(err){
        return next(err);
    }
}

exports.deleteMetadataById = async (req, res, next) => {

    const fileId = req.params.fid;

    try {
        const file = await Metadata.findById(fileId);

        if (!file) {
            return res.status(404).json({ message: 'Could not find file' });
        }

        const result = await Metadata.findByIdAndDelete(fileId);

        await cache.delete(fileId);
        await cahce.delete(file.fileName); 

        res.status(200).json(result);

    } catch(err) {
        return next(err);
    }
}

exports.hasValidId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.fid)) {
        return res.status(400).json({ message: 'File id is not valid' });
    }
    
    next();
}