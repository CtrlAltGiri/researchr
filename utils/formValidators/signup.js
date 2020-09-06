const {Validator} = require('node-input-validator');

function signUpValidator(formData) {

    console.log(formData);
    const v = new Validator(formData, {
      c_email: 'required|email',
      password: 'required'
    });
   
    v.check().then((matched) => {
        return matched;
    });
}

module.exports = {signUpValidator};