const mongoose = require('mongoose');

const MentorshipWaitingListSchema = new mongoose.Schema({
    name: String,
    email: String,
    type: String,
    session: String,
    department: String,
    yos: String,
    college: String,
    addedAt: Date
});

const MentorshipWaitingList = mongoose.model('mentorshipWaitingList', MentorshipWaitingListSchema, 'mentorshipWaitingList');

module.exports = MentorshipWaitingList;
