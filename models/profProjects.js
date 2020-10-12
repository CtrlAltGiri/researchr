const mongoose = require('mongoose');

const ProfProjectsSchema = new mongoose.Schema({
    name: String,
    desc: String,
    professorID: mongoose.Types.ObjectId,
    professorName: String,
    professorDesignation: String,
    college: String,
    department: String,
    views: Number,
    prereq: [ String ],
    duration: Number, // in months
    startDate: Date,
    dateOfCreation: Date,
    commitment: Number, // hours per week
    applicationCloseDate: Date,
    actualAppCloseDate: Date, // internally used to know if a project is manually toggled off or not
    location: String, // WFH or specific location
    restrictedView: Boolean,
    questionnaire: [ String ],
    tags: [ String ]
});

const ProfProjects = mongoose.model('profProjects', ProfProjectsSchema, 'profProjects');

module.exports = ProfProjects;
