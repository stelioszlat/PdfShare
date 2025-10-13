const Metadata = require('../models/metadata');
const { connect } = require('../util/database');
const { response, error } = require('../util/response');

let client = null;

module.exports.search = async (event) => {

    const { query, file, author, uploader } = event.pathParameters;
    const { keywords } = event.body;

    // if (!file || !author || !uploader || !keywords) {
    //     return res.status(400).json({ message: 'Query not found.' });
    // }

    client = await connect();

    try {

        const dbFiles = await Metadata.find({
            "$or": [
                { fileName: { $regex: query, $options: 'i' }}
            ]
        });

        if (!dbFiles) {
            return res.status(404).json('Could not find file.')
        }

        response(200, { files: dbFiles });

    } catch (err) {
        console.error(err);
        response(500, { message: "An error occurred" });
    }
}