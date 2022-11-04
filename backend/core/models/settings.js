const mongoose = require('mongoose');

const settingSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    itemsPerPage: {type: Number}
}, { timestamps: true, collection: 'settings' });

module.exports = mongoose.model('Settings', settingSchema);