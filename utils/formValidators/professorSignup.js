const { Validator } = require('node-input-validator');
const niv = require('node-input-validator');
const { collegeValues, branchValues } = require('../../client/src/common/data/collegeData');

//custom error messages for each error that is sent to front end
niv.addCustomMessages({
    required: 'The :attribute field must not be empty.',
    string: 'The :attribute field must be a string',
    'name.maxLength': 'Name cannot exceed more than 50 characters',
    'password.same': 'The passwords do not match',
    'college.maxLength': 'College Name cannot exceed more than 50 characters',
    'designation.maxLength': 'Designation cannot exceed more than 50 characters',
    'department.maxLength': 'Department Name cannot exceed more than 50 characters'
});

async function professorSignUpValidator(formData) {

    let retVal = true;
    const v = new Validator(formData, {
        c_email: 'required|email',
        name: 'required|string|maxLength:100',
        password: 'required|string|same:confirm_password',
        confirm_password: 'required|string',
        college: 'required|string|maxLength:100',
        designation: 'required|string|maxLength:100',
        department: 'required|string|maxLength:100'
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
        v.errors['password'] = {'message': 'The password must contain between 8 and 16 characters and include ' +
                'at least one capital letter, one small letter, one number and one special character'}
    }

    if(!(collegeValues.find(c => c === formData.college) && branchValues.find(b => formData.department))){
        retVal = false;
        v.errors['college'] = {'message': 'Please choose the values from the dropdown.'}
    }

    return [retVal, v.errors];
}

module.exports = { professorSignUpValidator };
