const { Router } = require('express');
const { graphqlHTTP } = require('express-graphql');

const cache = require('../../shared/redis-util');
const index = require('../../shared/elastic-util');
const Metadata = require('../models/metadata');

const searchSchema = require('../graphql/schema');
const searchResolver = require('../graphql/resolvers');

const router = Router();

// /api/search
router.post('', graphqlHTTP({
    schema: searchSchema,
    rootValue: searchResolver,
    graphiql: true
}));

router.get('/:fid', async (req, res, next) => {

    const file = req.params.fid;

    try {

        const cachedFile = await cache.get(file);

        if (cachedFile) {
            return res.status(200).json(JSON.parse(cachedFile));
        }

        // search also in elastic cluster...
        
        const indexedFile = await index.searchIndex(file)

        if (indexedFile) {
            return res.status(200).json(indexedFile);
        }

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