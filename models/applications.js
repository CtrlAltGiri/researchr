const mongoose = require('mongoose');

const ApplicationsSchema = new mongoose.Schema({
    name: String, // student name
    college: String, // student college
    branch: String, // student branch
    profApplications: [
        {
            projectID: {type: mongoose.Types.ObjectId, unique: true},
            name: String, // project name
            sameCollege: Boolean, // If the project offered is from the same college
            cgpa: Number, // student cgpa at time of application
            professorName: String,
            status: String,
            doa: Date, // date of application
            answers: [ String ],
            sop: String,
            messages: [
                {
                    timestamp: Date,
                    message: String
                }],
            feedbacks: [
                {
                    timestamp: Date,
                    feedback: String,
                    rating: Number
                }
            ],
            professorMsg: String,
            timeToAccept: Date,
        }
    ]
});

const Applications = mongoose.model('applications', ApplicationsSchema, 'applications');

module.exports = Applications;
