const mongoose = require('mongoose');

const ApplicationsSchema = new mongoose.Schema({
    profApplications: [
        {
            projectID: mongoose.Types.ObjectId,
            name: String,
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
