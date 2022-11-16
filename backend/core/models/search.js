const mongoose = require("mongoose");

const searchSchema = mongoose.Schema({
    text: { type: String },
    fileName: { type: String },
    author: { type: String },
    keywords: [
        { type: String },
    ],
}, { timestamps: true, collection: 'search' });

module.exports = mongoose.model("Search", searchSchema);
