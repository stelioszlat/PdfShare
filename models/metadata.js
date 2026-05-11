const mongoose = require("mongoose");

const metadataSchema = mongoose.Schema({
  fileName: { type: String, required: true },
  author: { type: String },
  uploader: { type: String },
  version: { type: Number },        // add version_type=external to elasticsearch and pass the version
  fileSize: { type: Number },
  pageCount: { type: Number },
  fileType: { type: String },
  pdfVersion: { type: String },
  keywords: [new mongoose.Schema({
    word: String,
    count: Number
  }, { _id: false })]
}, { timestamps: true, collection: 'metadata' });

module.exports = mongoose.model("Metadata", metadataSchema);
