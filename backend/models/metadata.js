const mongoose = require("mongoose");

const metadataSchema = mongoose.Schema({
  fileName: { type: String },
  uploader: { type: String },
  // dateAdded: { type: String },         // added from mongo by using timestamps flag
  // dateModified: { type: String },
  timesQueried: { type: Number },
  timesModified: { type: Number },
  version: { type: Number },        // add version_type=external to elasticsearch and pass the version
  // nodes: [
  //   {
  //     nodeId: { type: String },
  //   },
  // ],
  keywords: [
    {
      keyword: { type: String },
      appeared: { type: Number },
    },
  ],
  canBeModifiedBy: [                  // security constraints
    {
      modifier: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      isUploader: { type: Boolean }
    }
  ],
  edits: [                              // editing logs
    { 
      editId: { type: mongoose.Schema.Types.ObjectId, ref: 'Edit'},
    }
  ]
}, { timestamps: true, collection: 'metadata' });

module.exports = mongoose.model("Metadata", metadataSchema);
