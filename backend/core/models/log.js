const mongoose = require('mongoose');

const logSchema = mongoose.Schema({
    userName: {type: String},
    logTime: {type: String},        // Date
    ipAddress: {type: String},
    url: {type: String},
    authorization: {type: String},
    message: {type: String}
}, { timestamps: true, collection: 'logs' });

module.exports = mongoose.model('Log', logSchema);