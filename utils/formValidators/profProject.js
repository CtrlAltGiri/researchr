const { Validator } = require('node-input-validator');
const niv = require('node-input-validator');
const arrayNullable = require('./arrayNullable');

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
    'applicationCloseDate.dateAfterToday': 'The application closing date must be valid',
    'startDate.dateAfterToday': 'The starting date must be at least one day later'
});

niv.extend('arrayNullable', arrayNullable);

async function profProjectValidator(formData) {

    let retVal = true;
    const v = new Validator(formData, {
        name: 'required|string|maxLength:200',
        desc: 'required|string|maxLength:2000',
        prereq: 'required|arrayUnique|length:10,0',
        'prereq.*': 'required|string|maxLength:400',
        duration: 'required|numeric|max:100', // in months
        location: 'required|string|maxLength:200',
        applicationCloseDate: 'required|dateAfterToday:0,days',
        startDate: 'required|dateAfterToday:1,days',
        questionnaire: 'arrayNullable:10,300',
        commitment: 'required|numeric|max:168', //hrs per week
        restrictedView: 'required|boolean',
        tags: 'required|arrayUnique|length:5,0',
        'tags.*': 'required|string|maxLength:300',
    });

    retVal = await v.check()

    return [retVal, v.errors];
}

module.exports = { profProjectValidator };
