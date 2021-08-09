const mongoose = require("mongoose");

const metadataSchema = mongoose.Schema({
  fileName: { type: String },
  uploader: { type: String },
  dateAdded: { type: String },
  dateModified: { type: String },
  timesQueried: { type: Number },
  nodes: [
    {
      nodeId: { type: String },
    },
  ],
  keywords: [
    {
      keyword: { type: String },
      appeared: { type: Number },
    },
  ],
});

module.exports = mongoose.model("Metadata", metadataSchema);
