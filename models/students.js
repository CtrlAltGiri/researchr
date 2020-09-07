const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const StudentsSchema = new mongoose.Schema({
    c_email: String,
    p_email: String, 
    cvElements: Object,
    TandC: Boolean,
    hash: String,
    salt: String,
    active: Boolean,
    verifyHash: String
});

StudentsSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

StudentsSchema.methods.setVerifyHash = function() {
    this.verifyHash = crypto.randomBytes(128).toString('hex');
    return this.verifyHash;
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
