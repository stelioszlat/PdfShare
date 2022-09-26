const mongoose = require('mongoose');

const settingSchema = mongoose.Schema({
    itemsPerPage: {type: Number}
}, { timestamps: true, collection: 'settings' });

module.exports = mongoose.model('Settings', settingSchema);