const mongoose = require('mongoose');

const ApplicationsSchema = new mongoose.Schema({
    profApplications: Array
});

const Applications = mongoose.model('applications', ApplicationsSchema, 'applications');

module.exports = Applications;
