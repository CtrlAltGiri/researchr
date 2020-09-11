const mongoose = require('mongoose');
const crypto = require('crypto');

const ProfessorsSchema = new mongoose.Schema({
    name: String,
    college: String,
    doj: Date,
    lastLogin: Date,
    c_email: String,
    designation: String,
    completed: Boolean, //completed his profile?
    TandC: Boolean, //TandC for prof?
    hash: String,
    salt: String,
    active: Boolean,
    verifyHash: String,
    resetHash: String,
    resetExpires: Date
});

ProfessorsSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

ProfessorsSchema.methods.setVerifyHash = function() {
    this.verifyHash = crypto.randomBytes(128).toString('hex');
    return this.verifyHash;
};

// setting hash for reset password flow
ProfessorsSchema.methods.setResetHash = function() {
    this.resetHash = crypto.randomBytes(128).toString('hex');
    this.resetExpires = Date.now() + 3600000; // 1 hour
    return this.resetHash;
};

ProfessorsSchema.methods.validatePassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

const Professors = mongoose.model('professors', ProfessorsSchema, 'professors');

module.exports = Professors;