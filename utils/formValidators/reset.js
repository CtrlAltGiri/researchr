const {Validator} = require('node-input-validator');
const niv = require('node-input-validator');

//custom error messages for each error that is sent to front end
niv.addCustomMessages({
    required: 'The :attribute field must not be empty.',
    string: 'The :attribute field must be a string',
    'password.same': 'The passwords do not match',
});

//validator for reset password form
async function resetValidator(formData) {

    let retVal = true;
    const v = new Validator(formData, {
        password: 'required|string|same:confirm_password',
        confirm_password: 'required|string'
    });

    retVal = await v.check()

    // check password regex
    // One capital letter
    // One small letter
    // One number
    // One special character
    // Between 8 and 16 characters
    if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$/.test(formData.password)){
        retVal = false;
        v.errors['password'] = {'message': 'The password must contain between 8 and 16 characters and include atleast one capital letter, one small letter, one number and one special character'}
    }
    console.log(v.errors);

    return [retVal, v.errors];
}

module.exports = {resetValidator};
