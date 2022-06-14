const User = require('../models/user');
const Metadata = require('../models/metadata');
const bcrypt = require('bcrypt');

const cache = require('../util/redis-util');


exports.getFile = async (req) => {
    const body = req.body;

    const file = await Metadata.findOne();
}

module.exports = {
    search: async function (args, req) {

        // search in redis

        // if not in redis then search in the db
        const file = await Metadata.findOne({
            ...req.body
        });

        if (!file) {
            const error = 'File does not exist.';
        }

        // construct return body

        // return
        return {
            ...file
        }
    }
};