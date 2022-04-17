const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String },
    loginToken: { type: String },
    lastLogin: { type: Date }
}, { timestamps: true, collection: 'users' });

module.exports = mongoose.model('User', UserSchema);