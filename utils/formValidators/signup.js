const {Validator} = require('node-input-validator');

async function signUpValidator(formData) {

    let retVal = true;
    const v = new Validator(formData, {
      c_email: 'required|email',
      p_email: 'required|email',
      name: 'required',
      password: 'required',
      college: 'required',
      branch: 'required',
      yog: 'required'
    });
   
    retVal = await v.check()
    console.log("errors - ", v.errors)
    return retVal;
}

module.exports = {signUpValidator};