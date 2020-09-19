const { Validator } = require('node-input-validator');
const niv = require('node-input-validator');

//custom error messages for each error that is sent to front end
niv.addCustomMessages({
    required: 'The :attribute field must not be empty.',
    string: 'The :attribute field must be a string',
    maxLength: 'The :attribute exceeds the number of characters allowed',
    boolean: 'The :attribute field must be a boolean value',
    arrayUnique: 'The :attribute field must be a unique array',
    max: 'The :attribute exceeds its maximum allowed value',
    length: 'The :attribute exceeds its maximum length',
    numeric: 'The :attribute must be a number',
    'applicationCloseDate.dateAfterToday': 'The application closing date must be at least one day later',
    'startDate.dateAfterToday': 'The starting date must be at least two days later'
});

async function updateProfProjectValidator(formData) {
    // only the following fields are allowed to be updated in a project
    let retVal = true;
    const v = new Validator(formData, {
        desc: 'string|maxLength:300',
        prereq: 'arrayUnique|length:10,0',
        'prereq.*': 'string|maxLength:400',
        duration: 'numeric|max:100', // in months
        location: 'string|maxLength:200',
        applicationCloseDate: 'dateAfterToday:1,days',
        startDate: 'dateAfterToday:2,days',
        commitment: 'numeric|max:168', //hrs per week
        restrictedView: 'boolean'
    });

    retVal = await v.check()

    return [retVal, v.errors];
}

module.exports = { updateProfProjectValidator };
