const Metadata = require('../models/metadata');

exports.search = async (req, res, next) => {
    console.log(req.query);
    const { query, file, author, uploader } = req.query;
    const { keywords } = req.body;

    // if (!file || !author || !uploader || !keywords) {
    //     return res.status(400).json({ message: 'Query not found.' });
    // }

    try {

        const dbFiles = await Metadata.find({
            "$or": [
                { fileName: { $regex: query, $options: 'i' }}
            ]
        });

        if (!dbFiles) {
            return res.status(404).json('Could not find file.')
        }

        res.status(200).json({ files: dbFiles });

    } catch (err) {
        return next(err);
    }
}