const {Validator} = require('node-input-validator');
const niv = require('node-input-validator');

//custom error messages for each error that is sent to front end
niv.addCustomMessages({
    required: 'The :attribute field must not be empty.',
    string: 'The :attribute field must be a string',
    'new_password.same': 'The passwords do not match',
});

//validator for update password form
async function updatePasswordValidator(formData) {

    let retVal = true;
    const v = new Validator(formData, {
        current_password: 'required|string',
        new_password: 'required|string|same:confirm_new_password',
        confirm_new_password: 'required|string'
    });

    retVal = await v.check();

    // check password regex
    // One capital letter
    // One small letter
    // One number
    // One special character
    // Between 8 and 16 characters
    if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$/.test(formData.new_password)){
        retVal = false;
        v.errors['password'] = {'message': 'The password must contain between 8 and 16 characters and include ' +
                'at least one capital letter, one small letter, one number and one special character'}
    }

    console.log(v.errors);

    return [retVal, v.errors];
}

module.exports = {updatePasswordValidator};
