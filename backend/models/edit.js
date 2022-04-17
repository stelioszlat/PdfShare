const mongoose = require('mongoose');

const editSchema = mongoose.Schema({
    editor: { type: String },
    editDate: { type: Date },
    edit: {type: String },
}, { timestamps: true, collection: 'edits'});

module.exports = mongoose.model('Edit', editSchema)