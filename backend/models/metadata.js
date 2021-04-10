const mongoose = require('mongoose');


const metadataSchema = mongoose.Schema({
    fileName: {type: String, required: true},
    uploader: {type: String, required: true},
    dateAdded: {type: String, required: true},
    dateModified: {type: String},
    timesQueried: {type: Number},
    nodes: [{
        nodeId: {type:String}
    }],
    keywords: [{
        keyword: {type: String},
        appeared: {type: Number}
    }]
});

module.exports = mongoose.model('Metadata', metadataSchema);