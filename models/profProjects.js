const mongoose = require('mongoose');
const { ObjectID } = require("mongoose");

const ProfProjectsSchema = new mongoose.Schema({
    name: String,
    desc: String,
    professorID: ObjectID,
    professorName: String,
    professorDesignation: String,
    college: String,
    views: BigInt,
    prereq: Array,
    duration: Number, // in months
    startDate: Date,
    dateOfCreation: Date,
    applicationCloseDate: Date,
    location: String, // WFH or specific location
    questionnaire: Array
});

const ProfProjects = mongoose.model('profProjects', ProfProjectsSchema);

module.exports = ProfProjects;