const Students = require('../../models/students')
const passport = require('../../config/passport');
const { resetValidator } = require("../../utils/formValidators/reset");
const { forgotValidator } = require("../../utils/formValidators/forgot");
const { logInValidator } = require("../../utils/formValidators/login");
const { sendVerificationEmail, sendPasswordResetEmail } = require('../../utils/email/sendgirdEmailHelper');
const { signUpValidator } = require('../../utils/formValidators/signup');
const { colleges, branches, yog, degrees} = require('../../client/src/common/data/collegeData');
const logger = require('../../config/winston');

async function postLoginStudent(req, res, next) {
    // this validator just checks the email validity
    const values = await logInValidator(req.body);
    const retVal = values[0];
    const error = values[1];
    if (retVal === false) {
        return res.render("login", { wrongCreds: false, unverified: false, errorMsg: error.c_email.message });
    }

    //validation successful
    //continue here
    passport.authenticate('local-student', {}, function (err, user, info) {
        if (err) {
            throw (err);
        }
        if (!user) {
            logger.ant("Incorrect credentials for student: %s", req.body.c_email);
            return res.render("login", { wrongCreds: true, unverified: false });
        }
        // check if user is active i.e. college email id is verified or not
        if (!user.active) {
            logger.ant("Unverified user login for student: %s", req.body.c_email);
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

async function postSignupStudent(req, res) {
    const values = await signUpValidator(req.body);
    const retVal = values[0]
    const errors = values[1]
    if (retVal === false) {
        return res.render('student/signup', {
            name: req.body.name,
            p_email: req.body.p_email,
            c_email: req.body.c_email,
            college: req.body.college,
            branch: req.body.branch,
            degree: req.body.degree,
            yog: req.body.yog,
            colleges: colleges,
            yogs: yog,
            degrees: degrees,
            branches: branches,
            errorMsg: "Please ensure all fields are entered correctly.",
            errors: errors
        });
    }

    // check if email is already registered in the database
    Students.findOne({ 'c_email': req.body.c_email }, function (err, result) {
        if (err) {
            logger.tank(err);
            return res.redirect('/signup/error');
        }
        // return back to signup page and show email is already in use
        else if (result && result.active) {
            return res.render('student/signup', {
                colleges: colleges,
                yogs: yog,
                degrees: degrees,
                branches: branches, errorMsg: "This email has already been registered with us" 
            });
        }
        // if email exists in database but is not verified then update the existing one with new details
        else if (result && !result.active) {
            result.name = req.body.name;
            result.p_email = req.body.p_email;
            result.c_email = req.body.c_email;
            result.password = req.body.password;
            result.college = req.body.college;
            result.branch = req.body.branch;
            result.degree = req.body.degree;
            result.yog = req.body.yog;
            result.active = false;
            result.TandC = false;
            result.completed = false;
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
                    logger.tank("Error in saving student to collection: %s", req.body.c_email);
                    return res.redirect('/signup/error');
                }
                else {
                    sendVerificationEmail(req.body.c_email, req.body.name, token, "student")
                        .then(r => logger.ant("Sent student signup verification email successfully to %s", req.body.c_email))
                        .catch(function (err) { logger.tank(err); });
                    //TODO(aditya): Make a proper webpage for this
                    res.render('signUpComplete');
                }
            })

        }
        else {
            // add user to database
            const finalUser = new Students({
                name: req.body.name,
                p_email: req.body.p_email,
                c_email: req.body.c_email,
                password: req.body.password,
                college: req.body.college,
                branch: req.body.branch,
                degree: req.body.degree,
                yog: req.body.yog,
                active: false,
                TandC: false,
                completed: false
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
                    logger.tank("Error in saving student to collection: %s", req.body.c_email);
                    return res.redirect('/signup/error');
                }
                else {
                    sendVerificationEmail(req.body.c_email, req.body.name, token, "student")
                        .then(r => logger.ant("Sent student signup verification email successfully to %s", req.body.c_email))
                        .catch(function (err) { logger.tank(err); });
                    //TODO(aditya): Make a proper webpage for this
                    res.render('signUpComplete');
                }
            })
        }
    });
}


function getVerifyStudent(req, res) {
    // check if req.query.token is undefined
    if(!req.query.token) {
        logger.ant("Token not found in student verification");
        return res.end("<h1>Bad Request</h1>");
    }

    Students.findOne({ verifyHash: req.query.token }, function (err, student) {
        if (err) {
            logger.tank(err);
            return res.redirect('/verify/error');
        }
        else if (!student) {
            // invalid verify link
            logger.ant("Invalid token in student email verification");
            return res.end("<h1>Bad Request</h1>");
        }
        else if (student && student.active) {
            // student already active
            logger.ant("Student email is already verified for %s", student.c_email);
            return res.end("<h1>Already verified</h1>");
        }
        else {
            // verify the student profile
            Students.updateOne(
                { _id: student._id },
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
                            logger.ant("Student email has been successfully verified for %s", student.c_email);
                            return res.redirect('/login');
                        }
                        // failed update or add
                        else {
                            logger.tank("Failed email verification for student %s", student.c_email);
                            return res.redirect('/verify/error');
                        }
                    }
                }
            )
        }
    })
}

async function postForgotStudent(req, res){
    // this validator just checks the email validity
    const values = await forgotValidator(req.body);
    const retVal = values[0]
    const error = values[1]
    if(retVal === false){
        return res.render("forgot", { c_email: req.body.c_email, errorMsg: error.c_email.message, type:"student" });
    }

    // validation successful
    // check if email is already registered in the database
    Students.findOne({'c_email': req.body.c_email}, function(err, result) {
        if (err) {
            logger.tank(err);
            return res.redirect('/forgot/error');
        }
        // No student with the given email found
        else if (!result) {
            return res.render('forgot', {c_email:"", errorMsg:"Seems like you have not signed up yet!", type:"student"});
        }
        // Student found but has not verified email yet
        else if (result && !result.active) {
            return res.render('forgot', {c_email:"", errorMsg:"Please verify your email address first or signup again", type:"student"});
        }
        // valid flow
        else if (result && result.active) {
            // set reset password hash and get the token for email
            let token = result.setResetHash();

            return result.save({}, function (err, result){
                if(err){
                    logger.tank(err);
                    return res.redirect('/forgot/error');
                }
                else if(!result){
                    logger.tank("Error in adding reset hash to student %s", req.body.c_email);
                    return res.redirect('/forgot/error');
                }
                else{
                    sendPasswordResetEmail(req.body.c_email, token, "student")
                        .then(r => logger.ant("Sent student reset password email successfully to %s", req.body.c_email))
                        .catch(function (err) { logger.tank(err); });
                    return res.render('forgot', {c_email:"", errorMsg:"A password reset link has been sent to your college email address", type:"student"});
                }
            })
        }
    });
}

function getResetStudent(req, res){
    // check if req.query.token is undefined
    if(!req.query.token) {
        logger.ant("Token not found in student password reset API");
        return res.end("<h1>Bad Request</h1>");
    }

    Students.findOne({resetHash: req.query.token, resetExpires: {$gt: Date.now()}}, function (err, student){
        if(err) {
            logger.tank(err);
            return res.redirect('/reset/error');
        }
        else if (!student){
            // invalid reset link
            logger.ant("Student password reset link is invalid or expired");
            return res.render('forgot', {c_email:"", errorMsg:"Password reset link is invalid or has expired", type:"student"});
        }
        else{
            return res.render('reset', {type:"student", resetToken: req.query.token});
        }
    })
}

async function postResetStudent(req, res){
    // check if req.query.token is undefined
    if(!req.query.token) {
        logger.ant("Token not found in student password reset API");
        return res.end("<h1>Bad Request</h1>");
    }

    // validate the passwords
    const values = await resetValidator(req.body);
    const retVal = values[0]
    const error = values[1]
    if(retVal === false){
        if('password' in error){
            return res.render("reset", { errorMsg: error.password.message, type:"student" });
        }
        else if('confirm_password' in error){
            return res.render("reset", { errorMsg: error.confirm_password.message, type:"student" });
        }
        else{
            return res.render("reset", { errorMsg: "Error in resetting password. Please try again.", type:"student" });
        }
    }

    // validation successful
    // continue here
    Students.findOne({resetHash: req.query.token, resetExpires: {$gt: Date.now()}}, function (err, student){
        if(err){
            logger.tank(err);
            return res.redirect('/reset/error');
        }
        else if (!student) {
            // invalid reset link
            logger.ant("Student password reset link is invalid or expired");
            return res.render('forgot', {c_email:"", errorMsg:"Password reset link is invalid or has expired", type:"student"});
        }
        else{
            //assume student is already active otherwise wouldn't have got a reset link
            //set new password
            student.setPassword(req.body.password);
            student.resetHash = undefined;
            student.resetExpires = undefined;
            student.save({}, function (err, result){
                if(err){
                    logger.tank(err);
                    return res.redirect('/reset/error');
                }
                else if(!result){
                    logger.tank("Failed to update password in reset for student: %s", student.c_email);
                    return res.redirect('/reset/error');
                }
                else{
                    //TODO(aditya): Send an email with password change confirmation
                    logger.ant("Password has been successfully reset for student: %s", student.c_email);
                    return res.redirect('/login');
                }
            })
        }
    })
}


module.exports = { postLoginStudent, postSignupStudent, getVerifyStudent, postForgotStudent, getResetStudent, postResetStudent};