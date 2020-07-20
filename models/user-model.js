const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    linkedInID: String,
    photos: Array,
    _raw: String,
    emails: Array,
    _emailJson: Object
});

const User = mongoose.model('user', userSchema);

module.exports = User;