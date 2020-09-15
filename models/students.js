const mongoose = require('mongoose');
const crypto = require('crypto');

const StudentsSchema = new mongoose.Schema({
    name: String,
    college: String,
    degree: String,
    branch: String,
    yog: Number,
    doj: Date,
    lastLogin: Date,
    c_email: String,
    p_email: String,
    cvElements: {
        education: {
            school:{
                scoring10: String,
                scoring12: String,
                grade10: String,
                grade12: String
            },
            college: [
                {
                    college: String,
                    degree: String,
                    branch: String,
                    yog: String,
                    cgpa: String,
                    experience: String,
                    coursework: [ String ],
                    logoURL: String
                }
            ]
        },
        workExperiences: [
            {
                organization: String,
                endDate: String,
                presentWork: Boolean,
                position: String,
                startDate: String,
                experience: String,
                proof: String,
                tags: [ String ],
                logoURL: String
            }
        ],
        projects: [
            {
                professor: String,
                college: String,
                startDate: String,
                endDate: String,
                researchProject: Boolean,
                title: String,
                experience: String,
                proof: String,
                tags: [ String ],
                logoURL: String
            }
        ],
        interestTags: [ String ]
    },
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

const Students = mongoose.model('students', StudentsSchema, 'students');

module.exports = Students;
