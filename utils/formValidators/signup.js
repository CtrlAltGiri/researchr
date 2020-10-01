const {Validator} = require('node-input-validator');
const niv = require('node-input-validator');
const {colleges, collegeValues, branchValues, degreeValues, yogValues} = require('../../client/src/common/data/collegeData');

//custom error messages for each error that is sent to front end
niv.addCustomMessages({
    required: 'The :attribute field must not be empty.',
    string: 'The :attribute field must be a string',
    'name.maxLength': 'Name cannot exceed more than 50 characters',
    'password.same': 'The passwords do not match',
    'yog.dateFormat': 'The Year of Graduation must be a valid year',
    'college.maxLength': 'College Name cannot exceed more than 50 characters',
    'branch.maxLength': 'Branch Name cannot exceed more than 50 characters',
    'degree.maxLength': 'Degree cannot exceed more than 50 characters'
});

async function signUpValidator(formData) {

    let retVal = true;
    const v = new Validator(formData, {
        c_email: 'required|email',
        p_email: 'required|email',
        name: 'required|string|maxLength:100',
        password: 'required|string|same:confirm_password',
        confirm_password: 'required|string',
        college: 'required|string|maxLength:100',
        degree: 'required|string|maxLength:100',
        branch: 'required|string|maxLength:100',
        yog: 'required|dateFormat:YYYY'
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

    let studDomain;
    if(!(collegeValues.find(c, index => {c === formData.college; studDomain = index;} ) && branchValues.find(b => formData.branch) && degreeValues.find(d => d === formData.degree) && yogValues.find(y => y === formData.yog))){
        retVal = false;
        v.errors['college'] = {'message': 'Please choose the values from the dropdown.'}
    }

    // TODO (Giri): Test this, haven't done it - no time. -> just check if studDomain is coming correctly.
    studDomain = new RegExp(colleges[studDomain].studentDomain);
    if(!(studDomain.test(formData.c_email))){
        retVal = false;
        v.errors['c_email'] = {"message": "The entered college email is not valid."}
    }

    return [retVal, v.errors];
}

module.exports = {signUpValidator};
