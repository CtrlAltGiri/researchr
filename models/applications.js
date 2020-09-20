const mongoose = require('mongoose');

const ApplicationsSchema = new mongoose.Schema({
    name: String,
    college: String,
    branch: String,
    profApplications: [
        {
            projectID: {type: mongoose.Types.ObjectId, unique: true},
            name: String,
            sameCollege: Boolean, // If the project offered is from the same college
            cgpa: Number,
            professorName: String,
            status: String,
            doa: Date,
            answers: [ String ],
            sop: String,
            professorMsg: String,
            timeToAccept: Date,
        }
    ]
});

const Applications = mongoose.model('applications', ApplicationsSchema, 'applications');

module.exports = Applications;
