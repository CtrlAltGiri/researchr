const {Validator} = require('node-input-validator');

async function signUpValidator(formData) {

    let retVal = true;
    const v = new Validator(formData, {
      c_email: 'required|email',
      password: 'required'
    });
   
    retVal = await v.check()
    console.log("errors - ", v.errors)
    return retVal;
}

module.exports = {signUpValidator};