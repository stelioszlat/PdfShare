const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: { type: String },
    email: { type: String },
    password: { type: String },
    lastLogin: { type: String },
    accessToken: { type: String },
    refreshToken: { type: String }
}, { timestamps: true, collection: 'users' });

module.exports = mongoose.model('User', UserSchema);