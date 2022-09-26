const User = require('../models/user');
const Metadata = require('../models/metadata');
const bcrypt = require('bcrypt');

const cache = require('../../shared/redis-util');


// exports.getFile = async ((req: any, res: any,) => {
//     const { fileName, uploader, keywords } = req.body;

//     try {

//         const files = await Metadata.find({
//             fileName,
//             uploader,
//             keywords
//         });

//         if (!files) {
//             return res.status(404).json({ message: 'No results' });
//         }

//         res.status(200).json({ files });

//     } catch (err) {
//         return next(err);
//     }
// }

module.exports = resolvers = {
    search: async function (args, req) {
        const file = req.body.file;

        if (!file) {
            throw new Error('Could not find file');
        }

        const cachedFile = cache.get(file);
        if (!cachedFile) {

        }        

        // if not in redis then search in the db
        const fileFound = await Metadata.findOne({
            ...req.body
        });

        if (!fileFound) {
            const error = 'File does not exist.';
        }

        // construct return body

        // return
        return {
            ...file
        }
    }
};