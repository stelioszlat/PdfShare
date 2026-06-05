const mongoose = require('mongoose');
const Metadata = require('../models/metadata');
const User = require('../models/user');

const { connect, disconnect } = require('../util/database');
const { response, error } = require('../util/response');

module.exports.getMetadata = async (event) => {
    let query = JSON.parse(event.queryStringParameters);
    let limit = query == null ? 10 : query.limit;
    let page = query == null ? 1 : query.page;

    try {
        await connect();

        const files = await Metadata.find({}, { keywords: 0, __v: 0}).limit(+limit).skip((+page - 1) * +limit);

        let count = await Metadata.countDocuments();

        if (!files) {
            return response(404, { message: 'Could not find any files' });
        }

        return response(200, {
            page,
            limit,
            count,
            currentPage: Math.ceil(count / limit),
            files
        });
    } catch (err) {
        console.log(err);
        return error('Could not get metadata');
    }
}

module.exports.addMetadata = async (event) => {
    const { fileName, uploader, keywords } = JSON.parse(event.body);

    if (!fileName) {
        return response(400, { message: 'File name is required' });
    }

    try {
        await connect();

        const file = await this.createMetadata({ fileName, uploader, keywords });

        if (!file) {
            return response(500, { message: 'Could not create metadata' });
        }

        return response(200, { file });
    } catch (err) {
        console.log(err);
        return response(500, { message: 'Could not create metadata' });
    }
}

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

        console.log('Added new file: ' + file.fileName);

        return file;
    }
    catch(err){
        console.log(err);
        return false;
    }
}

module.exports.getMetadataByUserId = async (event) => {
    const userId = event.pathParameters.userId;

    if (!userId) {
        return response(400, { message: 'User id is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return response(400, { message: 'User id is not valid' });
    }

    try {
        await connect();

        const user = await User.findById(userId, { keywords: 0, _v: 0 });

        if (!user) {
            return response(404, { message: 'Could not find user' });
        }

        const files = await Metadata.find({
            uploader: user.username
        }, { keywords: 0 });

        if (!files) {
            return response(404, { message: 'Could not find files' });
        }

        return response(200, { files });
    
    } catch(err) {
        console.log(err);
        return error('Could not get user files');
    }
}

module.exports.getMetadataById = async (event) => {
    const fileId = event.pathParameters;

    if (!fileId) {
        return response(400, { message: 'File id is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(fileId)) {
        return response(400, { message: 'File id is not valid' });
    }

    try {
        await connect();

        const file = Metadata.findById(fileId, { keywords: 0, __v: 0});

        
        if (!file) {
            return response(404, { message: 'Could not find file.' });
        }

        return response(200, { file });
    } catch (err) {
        console.log(err);
        return error('Could not get file')
    }
}

module.exports.deleteMetadata = async (event) => {
    const fileId = event.pathParameters;

    if (!fileId) {
        return response(400, { message: 'File id is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(fileId)) {
        return response(400, { message: 'File id is not valid' });
    }

    try {
        await connect();

        const file = Metadata.findByIdAndDelete(fileId);

        
        if (!file) {
            return response(404, { message: 'Could not delete file.' });
        }

        return response(200, { file });
    } catch (err) {
        console.log(err);
        return error('Could not delete file')
    }
}