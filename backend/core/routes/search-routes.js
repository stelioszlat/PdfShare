const { Router } = require('express');

const cache = require('../util/redis-util');
const index = require('../util/elastic-util');
const Metadata = require('../models/metadata')

const router = Router();

// /api/search
router.post('', async (req, res, next) => {

    const { file, author, keywords } = req.body;

    try {

        const cachedFile = await cache.get(file);

        if (cachedFile) {
            return res.status(200).json(JSON.parse(cachedFile));
        }

        // search also in elastic cluster...
        
        // const indexedFile = await index.searchIndex(file)

        // if (indexedFile) {
        //     return res.status(200).json(indexedFile);
        // }

        const dbFile = await Metadata.findById(file);

        if (!dbFile) {
            return res.status(404).json('Could not find file.')
        }

        res.status(200).json(dbFile);

    } catch (err) {
        return next(err);
    }
});

module.exports = router;