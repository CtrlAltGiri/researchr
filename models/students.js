const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const StudentsSchema = new mongoose.Schema({
    name: String,
    college: String,
    degree: String,
    branch: String,
    doj: Date,
    lastLogin: Date,
    c_email: String,
    p_email: String,
    cvElements: Object,
    completed: Boolean,
    TandC: Boolean,
    hash: String,
    salt: String,
    active: Boolean,
    verifyHash: String,
    resetHash: String,
    resetExpires: Date
});

StudentsSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

StudentsSchema.methods.setVerifyHash = function() {
    this.verifyHash = crypto.randomBytes(128).toString('hex');
    return this.verifyHash;
};

// setting hash for reset password flow
StudentsSchema.methods.setResetHash = function() {
    this.resetHash = crypto.randomBytes(128).toString('hex');
    this.resetExpires = Date.now() + 3600000; // 1 hour
    return this.resetHash;
};

StudentsSchema.methods.validatePassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

StudentsSchema.methods.generateJWT = function() {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    return jwt.sign({
        email: this.c_email,
        id: this._id,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, 'secret');
}

StudentsSchema.methods.toAuthJSON = function() {
    return {
        _id: this._id,
        email: this.c_email,
        token: this.generateJWT(),
    };
};

const Students = mongoose.model('students', StudentsSchema);

module.exports = Students;
