const passport = require('../../config/passport');
const { logInValidator } = require("../../utils/formValidators/login");
const { professorSignUpValidator } = require('../../utils/formValidators/professorSignup');
const Professors = require('../../models/professors');
const { resetValidator } = require("../../utils/formValidators/reset");
const { sendPasswordResetEmail } = require("../../utils/email/sendgirdEmailHelper");
const { forgotValidator } = require("../../utils/formValidators/forgot");
const { sendVerificationEmail } = require("../../utils/email/sendgirdEmailHelper");
const logger = require('../../config/winston');

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
            throw (err);
        }
        if (!user) {
            logger.ant("Incorrect credentials for professor: %s", req.body.c_email);
            return res.render("login", { wrongCreds: true, unverified: false });
        }
        // check if user is active i.e. college email id is verified or not
        if (!user.active) {
            logger.ant("Unverified user login for professor: %s", req.body.c_email);
            return res.render("login", { wrongCreds: false, unverified: true });
        }
        req.logIn(user, function (err) {
            if (err) {
                throw (err);
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
            logger.tank(err);
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
                    logger.tank(err);
                    return res.redirect('/signup/error');
                }
                else if (!updatedResult) {
                    logger.tank("Error in saving professor to collection: %s", req.body.c_email);
                    return res.redirect('/signup/error');
                }
                else {
                    sendVerificationEmail(req.body.c_email, req.body.name, token, "professor")
                        .then(r => logger.ant("Sent professor signup verification email successfully to %s", req.body.c_email))
                        .catch(function (err) { logger.tank(err); });
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
                    logger.tank(err);
                    return res.redirect('/signup/error');
                }
                else if (!result) {
                    logger.tank("Error in saving professor to collection: %s", req.body.c_email);
                    return res.redirect('/signup/error');
                }
                else {
                    sendVerificationEmail(req.body.c_email, req.body.name, token, "professor")
                        .then(r => logger.ant("Sent professor signup verification email successfully to %s", req.body.c_email))
                        .catch(function (err) { logger.tank(err); });
                    //TODO(aditya): Make a proper webpage for this
                    res.render('signUpComplete');
                }
            })
        }
    });
}

// function to verify the verifyHash of professor and set the profile as active to allow logins
function getVerifyProfessor(req, res) {
    // check if req.query.token is undefined
    if(!req.query.token) {
        logger.ant("Token not found in professor verification");
        return res.end("<h1>Bad Request</h1>");
    }

    Professors.findOne({ verifyHash: req.query.token }, function (err, professor) {
        if (err) {
            logger.tank(err);
            return res.redirect('/verify/error');
        }
        else if (!professor) {
            // invalid verify link
            logger.ant("Invalid token in professor email verification");
            return res.end("<h1>Bad Request</h1>");
        }
        else if (professor && professor.active) {
            // professor already active
            logger.ant("Professor email is already verified for %s", professor.c_email);
            return res.end("<h1>Already verified</h1>");
        }
        else {
            // verify the student profile
            Professors.updateOne(
                { _id: professor._id },
                {
                    $unset: { verifyHash: 1 },
                    $set: {
                        doj: Date.now(),
                        active: true
                    }
                },
                function (err, result) {
                    if (err) {
                        logger.tank(err);
                        return res.redirect('/verify/error');
                    }
                    else {
                        const { n, nModified } = result;
                        // check if document has been successfully updated in collection
                        if (n && nModified) {
                            logger.ant("Professor email has been successfully verified for %s", professor.c_email);
                            return res.redirect('/login');
                        }
                        // failed update the professor as active
                        else {
                            logger.tank("Failed email verification for professor %s", professor.c_email);
                            return res.redirect('/verify/error');
                        }
                    }
                }
            )
        }
    })
}


async function postForgotProfessor(req, res){
    // this validator just checks the email validity
    const values = await forgotValidator(req.body);
    const retVal = values[0]
    const error = values[1]
    if(retVal === false){
        return res.render("forgot", { c_email: req.body.c_email, errorMsg: error.c_email.message, type:"professor" });
    }

    // validation successful
    // check if email is already registered in the database
    Professors.findOne({'c_email': req.body.c_email}, function(err, professor) {
        if (err) {
            logger.tank(err);
            return res.redirect('/forgot/error');
        }
        // No professor with the given email found
        else if (!professor) {
            return res.render('forgot', {c_email:"", errorMsg:"Seems like you have not signed up yet!", type:"professor"});
        }
        // Professor found but has not verified email yet
        else if (professor && !professor.active) {
            return res.render('forgot', {c_email:"", errorMsg:"Please verify your email address first or signup again", type:"professor"});
        }
        // valid flow
        else if (professor && professor.active) {
            // set reset password hash and get the token for email
            let token = professor.setResetHash();

            return professor.save({}, function (err, result){
                if(err){
                    logger.tank(err);
                    return res.redirect('/forgot/error');
                }
                else if(!result){
                    logger.tank("Error in adding reset hash to professor %s", req.body.c_email);
                    return res.redirect('/forgot/error');
                }
                else{
                    sendPasswordResetEmail(req.body.c_email, token, "professor")
                        .then(r => logger.ant("Sent professor reset password email successfully to %s", req.body.c_email))
                        .catch(function (err) { logger.tank(err); });
                    return res.render('forgot', {c_email:"", errorMsg:"A password reset link has been sent to your college email address", type:"professor"});
                }
            })
        }
    });
}

function getResetProfessor(req, res){
    // check if req.query.token is undefined
    if(!req.query.token) {
        logger.ant("Token not found in professor password reset API");
        return res.end("<h1>Bad Request</h1>");
    }

    Professors.findOne({resetHash: req.query.token, resetExpires: {$gt: Date.now()}}, function (err, professor){
        if(err) {
            logger.tank(err);
            return res.redirect('/reset/error');
        }
        else if (!professor){
            // invalid reset link
            logger.ant("Professor password reset link is invalid or expired");
            return res.render('forgot', {c_email:"", errorMsg:"Password reset link is invalid or has expired", type:"professor"});
        }
        else{
            return res.render('reset', {type:"professor", resetToken: req.query.token});
        }
    })
}

async function postResetProfessor(req, res){
    // check if req.query.token is undefined
    if(!req.query.token) {
        logger.ant("Token not found in professor password reset API");
        return res.end("<h1>Bad Request</h1>");
    }

    // validate the passwords
    const values = await resetValidator(req.body);
    const retVal = values[0]
    const error = values[1]
    if(retVal === false){
        if('password' in error){
            return res.render("reset", { errorMsg: error.password.message, type:"professor" });
        }
        else if('confirm_password' in error){
            return res.render("reset", { errorMsg: error.confirm_password.message, type:"professor" });
        }
        else{
            return res.render("reset", { errorMsg: "Error in resetting password. Please try again.", type:"professor" });
        }
    }
    // validation successful
    // continue here
    Professors.findOne({resetHash: req.query.token, resetExpires: {$gt: Date.now()}}, function (err, professor){
        if(err){
            logger.tank(err);
            return res.redirect('/reset/error');
        }
        else if (!professor) {
            // invalid reset link
            logger.ant("Professor password reset link is invalid or expired");
            return res.render('forgot', {c_email:"", errorMsg:"Password reset link is invalid or has expired", type:"professor"});
        }
        else{
            //assume professor is already active otherwise wouldn't have got a reset link
            //set new password
            professor.setPassword(req.body.password);
            professor.resetHash = undefined;
            professor.resetExpires = undefined;
            professor.save({}, function (err, result){
                if(err){
                    logger.tank(err);
                    return res.redirect('/reset/error');
                }
                else if(!result){
                    logger.tank("Failed to update password in reset for professor: %s", professor.c_email);
                    return res.redirect('/reset/error');
                }
                else{
                    //TODO(aditya): Send an email with password change confirmation
                    logger.ant("Password has been successfully reset for professor: %s", professor.c_email);
                    return res.redirect('/login');
                }
            })
        }
    })
}

module.exports = { postLoginProfessor, postSignupProfessor, getVerifyProfessor, postForgotProfessor, getResetProfessor, postResetProfessor };
