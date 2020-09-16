const mongoose = require('mongoose');

const ApplicationsSchema = new mongoose.Schema({
    profApplications: [
        {
            projectID: {type: mongoose.Types.ObjectId, unique: true},
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
