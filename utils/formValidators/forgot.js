const {Validator} = require('node-input-validator');
const niv = require('node-input-validator');

//custom error messages for each error that is sent to front end
niv.addCustomMessages({
    required: 'The :attribute field must not be empty.',
    'c_email.email': 'Please enter a valid email address'
});

async function forgotValidator(formData) {
    let retVal = true;
    const v = new Validator(formData, {
        c_email: 'required|email'
    });

    retVal = await v.check()
    return [retVal, v.errors];
}

module.exports = {forgotValidator};
