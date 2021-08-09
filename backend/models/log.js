const mongoose = require('mongoose');

const logSchema = mongoose.Schema({
    userName: {type: String},
    logTime: {type: String},        // Date
    action: {type: String},
    message: {type: String}
});

module.exports = mongoose.model('Log', logSchema);