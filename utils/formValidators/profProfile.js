const { Validator } = require('node-input-validator');
const niv = require('node-input-validator');

//custom error messages for each error that is sent to front end
niv.addCustomMessages({
    string: 'The :attribute field must be a string',
    maxLength: 'The :attribute exceeds the number of characters allowed',
    arrayUnique: 'The :attribute field must be a unique array',
    length: 'The :attribute exceeds its maximum length'
});

async function profProfileValidator(formData) {

    let retVal = true;
    const v = new Validator(formData, {
        areasOfInterest : 'arrayUnique|length:5,0',
        'areasOfInterest.*': 'string|maxLength:200',
        courses: 'arrayUnique|length:10,0',
        'courses.*': 'string|maxLength:100',
        education: 'arrayUnique|length:4,0',
        'education.*': 'string|maxLength:200',
        books: 'arrayUnique|length:10,0',
        'books.*': 'string|maxLength:200',
        publications: 'arrayUnique|length:20,0',
        'publications.*': 'string|maxLength:200',
        projects: 'arrayUnique|length:20,0',
        'projects.*':'string|maxLength:200',
        patents: 'arrayUnique|length:10,0',
        'patents.*': 'string|maxLength:200',
        url: 'string|maxLength:200'
    });

    retVal = await v.check()

    return [retVal, v.errors];
}

module.exports = { profProfileValidator };
