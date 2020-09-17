const mongoose = require('mongoose');

const ProfProjectsSchema = new mongoose.Schema({
    name: String,
    desc: String,
    professorID: mongoose.Types.ObjectId,
    professorName: String,
    professorDesignation: String,
    college: String,
    views: Number,
    prereq: [ String ],
    duration: Number, // in months
    startDate: Date,
    dateOfCreation: Date,
    commitment: Number, // hours per week
    applicationCloseDate: Date,
    location: String, // WFH or specific location
    restrictedView: Boolean,
    questionnaire: [ String ]
});

const ProfProjects = mongoose.model('profProjects', ProfProjectsSchema, 'profProjects');

module.exports = ProfProjects;
