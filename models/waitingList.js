const mongoose = require('mongoose');

const WaitingListSchema = new mongoose.Schema({
    name: String,
    email: String,
    type: String,
    from: String,
    department: String,
    yos: String,
    addedAt: Date
});

const WaitingList = mongoose.model('waitingList', WaitingListSchema, 'waitingList');

module.exports = WaitingList;
