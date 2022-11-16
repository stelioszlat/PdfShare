const { Router } = require('express');

const cache = require('../util/redis-util');
const index = require('../util/elastic-util');
const Metadata = require('../models/metadata');
const Search = require('../models/search');

const router = Router();

// /api/search
router.post('', async (req, res, next) => {

    const { file, author, keywords } = req.body;

    try {

        const search = new Search({
            fileName: file,
            author: author,
            keywords: keywords
        });

        await search.save();

        const cachedFile = await cache.get(JSON.stringify(file));

        if (cachedFile) {
            return res.status(200).json(JSON.parse(cachedFile));
        }

        // search also in elastic cluster...
        
        // const indexedFile = await index.searchIndex(file)

        // if (indexedFile) {
        //     return res.status(200).json(indexedFile);
        // }

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