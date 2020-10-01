const { Validator } = require('node-input-validator');
const niv = require('node-input-validator');
const arrayNullable = require('./arrayNullable');

//custom error messages for each error that is sent to front end
niv.addCustomMessages({
    string: 'The :attribute field must be a string',
    maxLength: 'The :attribute exceeds the number of characters allowed',
    arrayUnique: 'The :attribute field must be a unique array',
    length: 'The :attribute exceeds its maximum length'
});

niv.extend('arrayNullable', arrayNullable); 

async function profProfileValidator(formData) {

    let retVal = true;
    const v = new Validator(formData, {
        areasOfInterest: 'arrayNullable:5,200',
        courses: 'arrayNullable:5,200',
        education: 'arrayNullable:5,100',
        books: 'arrayNullable:5,200',
        publications: 'arrayNullable:5,200',
        projects: 'arrayNullable:5,200',
        patents: 'arrayNullable:5,200',
        url: 'nullable|string|maxLength:200'
    });

    retVal = await v.check()
    return [retVal, v.errors];
}

module.exports = { profProfileValidator };
