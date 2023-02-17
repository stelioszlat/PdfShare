const { Router } = require('express');

const cache = require('../util/redis-util');
const Metadata = require('../models/metadata');

const router = Router();

// /api/search
router.post('', async (req, res, next) => {

    const { file, author, uploader } = req.query;
    const { keywords } = req.body;

    if (!file || !author || !uploader || !keywords) {
        res.status(400).json({ message: 'Query not found.' });
    }

    try {

        const cachedFile = await cache.get(JSON.stringify(file));

        if (cachedFile) {
            return res.status(200).json(JSON.parse(...cachedFile));
        }

        if (req.body.result) {
            res.status(200).json({ result });
        }

        const dbFile = await Metadata.find({
            fileName: file
        });

        if (!dbFile) {
            return res.status(404).json('Could not find file.')
        }

        res.status(200).json(dbFile);

    } catch (err) {
        return next(err);
    }
});

module.exports = router;