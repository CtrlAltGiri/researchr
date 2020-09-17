const passport = require('../../config/passport');
const { logInValidator } = require("../../utils/formValidators/login");
const { professorSignUpValidator } = require('../../utils/formValidators/professorSignup');
const Professors = require('../../models/professors');
const { sendVerificationEmail } = require("../../utils/email/sendgirdEmailHelper");

async function postLoginProfessor(req, res, next) {
    // this validator just checks the email validity
    const values = await logInValidator(req.body);
    const retVal = values[0]
    const error = values[1]
    if (retVal === false) {
        return res.render("login", { wrongCreds: false, unverified: false, errorMsg: error.c_email.message });
    }

    //validation successful
    //continue here
    passport.authenticate('local-professor', {}, function (err, user, info) {
        if (err) {
            console.log(err);
            return next(err);
        }
        if (!user) {
            console.log("NOT FOUND professor");
            return res.render("login", { wrongCreds: true, unverified: false });
        }
        // check if user is active i.e. college email id is verified or not
        if (!user.active) {
            return res.render("login", { wrongCreds: false, unverified: true });
        }
        req.logIn(user, function (err) {
            if (err) {
                console.log(err);
                return next(err);
            }
            return res.redirect('/platform');
        });
    })(req, res, next);
}

async function postSignupProfessor(req, res) {
    const values = await professorSignUpValidator(req.body);
    const retVal = values[0]
    const errors = values[1]
    if (retVal === false) {
        return res.render('professor/signup', {
            name: req.body.name,
            c_email: req.body.c_email,
            college: req.body.college,
            department: req.body.department,
            designation: req.body.designation,
            errorMsg: "Please ensure all fields are entered correctly.",
            errors: errors
        });
    }

    // check if email is already registered in the database
    Professors.findOne({ 'c_email': req.body.c_email }, function (err, result) {
        if (err) {
            console.log(err);
            return res.redirect('/signup/error');
        }
        // return back to signup page and show email is already in use
        else if (result && result.active) {
            return res.render('professor/signup', {
                errorMsg: "This email has already been registered with us"
            });
        }
        // if email exists in database but is not verified then update the existing one with new details
        else if (result && !result.active) {
            result.name = req.body.name;
            result.c_email = req.body.c_email;
            result.password = req.body.password;
            result.college = req.body.college;
            result.department = req.body.department;
            result.designation = req.body.designation;
            result.active = false;
            result.TandC = false;
            result.verified = false;
            // set password
            result.setPassword(req.body.password);
            // set verification hash and get the token for email
            let token = result.setVerifyHash();
            // add user to database and send a verification email
            return result.save({}, function (err, updatedResult) {
                if (err) {
                    console.log(err);
                    return res.redirect('/signup/error');
                }
                else if (!updatedResult) {
                    console.log("Error in saving professor to collection");
                    return res.redirect('/signup/error');
                }
                else {
                    sendVerificationEmail(req.body.c_email, req.body.name, token, "professor").then(r => console.log(r)).catch(function (err) { console.log(err) });
                    //TODO(aditya): Make a proper webpage for this
                    res.render('signUpComplete');
                }
            })
        }
        else {
            // add user to database
            const finalUser = new Professors({
                name: req.body.name,
                c_email: req.body.c_email,
                password: req.body.password,
                college: req.body.college,
                department: req.body.department,
                designation: req.body.designation,
                active: false,
                TandC: false,
                verified: false
            });

            // set password
            finalUser.setPassword(req.body.password);
            // set verification hash and get the token for email
            let token = finalUser.setVerifyHash();
            // add user to database and send a verification email
            return finalUser.save({}, function (err, result) {
                if (err) {
                    console.log(err);
                    return res.redirect('/signup/error');
                }
                else if (!result) {
                    console.log("Error in saving professor to collection");
                    return res.redirect('/signup/error');
                }
                else {
                    sendVerificationEmail(req.body.c_email, req.body.name, token, "professor").then(r => console.log(r)).catch(function (err) { console.log(err) });
                    //TODO(aditya): Make a proper webpage for this
                    res.render('signUpComplete');
                }
            })
        }
    });
}

module.exports = { postLoginProfessor, postSignupProfessor };
