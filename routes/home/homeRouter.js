const homeRouter = require('express').Router();
const Students = require('../../models/students');
const path = require('path');
const passport = require('../../config/passport');
const { resetValidator } = require("../../utils/formValidators/reset");
const { forgotValidator } = require("../../utils/formValidators/forgot");
const { logInValidator } = require("../../utils/formValidators/login");
const { sendVerificationEmail } = require('../../utils/email/sendgirdEmailHelper');
const { sendPasswordResetEmail } = require('../../utils/email/sendgirdEmailHelper');
const { signUpValidator } = require('../../utils/formValidators/signup');

homeRouter.route("/").get(function (req, res) {
    if (!req.isAuthenticated())
        res.render('homepage');
    else {
        res.redirect('/platform')
    }
}).post(function (req, res) {
        res.render('signup', { name: req.body.name, p_email: req.body.email });
    });

homeRouter.route("/login")
    .get(function (req, res) {
        if (req.isAuthenticated())
            res.redirect("/platform");
        else
            res.render("login", { wrongCreds: false, unverified: false });
    })
    .post(async function (req, res, next) {
        // this validator just checks the email validity
        const values = await logInValidator(req.body);
        const retVal = values[0]
        const error = values[1]
        if(!retVal){
            return res.render("login", { wrongCreds: false, unverified: false, errorMsg: error.c_email.message });
        }

        //validation successful
        //continue here
        passport.authenticate('local', {}, function (err, user, info) {
            if(err){ 
                console.log(err);
                return next(err);
            }
            if(!user){
                console.log("NOT FOUND");
                return res.render("login", { wrongCreds: true, unverified: false });
            }
            // check if user is active i.e. college email id is verified or not
            if(!user.active){
                return res.render("login", { wrongCreds: false, unverified: true });
            }
            req.logIn(user, function (err) {
                if(err){
                    console.log(err);
                    return next(err); 
                }
                return res.redirect('/platform');
            });
        })(req, res, next);
    });

homeRouter.route('/signup')
    .get(function(req,res){
        res.render('signup', {name: "", p_email: ""});
    })
    .post(async function(req, res){
        const values = await signUpValidator(req.body);
        const retVal = values[0]
        const errors = values[1]
        if(!retVal){
            return res.render('signup', {
                name:req.body.name,
                p_email:req.body.p_email,
                c_email: req.body.c_email,
                college:req.body.college,
                branch:req.body.branch,
                degree:req.body.degree,
                yog:req.body.yog,
                errorMsg:"Please ensure all fields are entered correctly.",
                errors: errors
            });
        }

        // validation successful
        // check if email is already registered in the database
        Students.findOne({'c_email': req.body.c_email}, function(err, result) {
            if (err){
                console.log(err);
                return res.redirect('/signup/error');
            }
            // return back to signup page and show email is already in use
            if(result && result.active){
                return res.render('signup', {errorMsg: "This email has already been registered with us"});
            }
            // if email verification has not been done, remove existing doc in collection and allow signup again
            else if(result){
                Students.deleteOne({ _id: result._id}, function(err, result) {
                    if(err){
                        console.log("Failed to remove entry from collection")
                        console.log(err);
                        return res.redirect('/signup/error');
                    }
                    console.log("1 document deleted");
                });
            }
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
            return finalUser.save({}, function (err, result){
                if(err){
                    console.log(err);
                    return res.redirect('/signup/error');
                }
                sendVerificationEmail(req.body.c_email, req.body.name, token).then(r => console.log(r)).catch(function (err){ console.log(err)});
                //TODO(aditya): Make a proper webpage for this
                res.render('signUpComplete');
            })
        });
    });

homeRouter.get('/verify',function(req,res){
    Students.findOne({ verifyHash:  req.query.token}, function (err, student) {
        if(err) {
            console.log(err);
            return res.redirect('/verify/error');
        }
        if(!student) {
            // invalid verify link
            console.log("Invalid verification link");
            res.end("<h1>Bad Request</h1>");
            return;
        }
        if(student && student.active) {
            console.log("Email has already been verified");
            res.end("<h1>Already verified</h1>");
            return;
        }
        // link verified for student
        Students.findByIdAndUpdate(
            {_id: student._id},
            {
                $unset: {verifyHash: 1},
                $set: {
                    doj: Date.now(),
                    active: true
                }
            },
            { useFindAndModify: false },
            function(err, result){
                if(err){
                    console.log(err);
                    return res.redirect('/verify/error');
                }
                else{
                    console.log("Email has been verified");
                }
            })
        return res.redirect('/platform');
    })
});

homeRouter.get('/logout', function (req, res) {
    req.logout();
    res.redirect("/");
});

homeRouter.get('/plsauthenticate', function(req, res){
    if(process.env.NODE_ENV === 'dev'){
        const user = {
           _id : '5f52765205ae1e5620e10c5e'
        }
        req.logIn(user, function (err) {
            if(err){
                console.log(err);
                return;
            }
            console.log("Dev authenticated");
            res.redirect('/platform')
        })
    }
})

// router for forgot password flow
homeRouter.route('/forgot')
    .get(function(req,res){
        res.render('forgot', {c_email: ""});
    })
    .post(async function(req, res){
        // this validator just checks the email validity
        const values = await forgotValidator(req.body);
        const retVal = values[0]
        const error = values[1]
        if(!retVal){
            return res.render("forgot", { c_email: req.body.c_email, errorMsg: error.c_email.message });
        }

        // validation successful
        // check if email is already registered in the database
        Students.findOne({'c_email': req.body.c_email}, function(err, result) {
            if (err) {
                console.log(err);
                return res.redirect('/forgot/error');
            }
            // No student with the given email found
            if (!result) {
                return res.render('forgot', {c_email:"", errorMsg:"Seems like you have not signed up yet!"});
            }
            // Student found but has not verified email yet
            if (result && !result.active) {
                return res.render('forgot', {c_email:"", errorMsg:"Please verify your email address first or signup again"});
            }
            // valid flow
            else if (result && result.active) {
                console.log(result);
                // set reset password hash and get the token for email
                let token = result.setResetHash();

                return result.save({}, function (err, result){
                    if(err){
                        console.log(err);
                        return res.redirect('/forgot/error');
                    }
                    //TODO(aditya): Not sure what to do with the 'r' here and remove token logging once email sender has been set
                    sendPasswordResetEmail(req.body.c_email, token).then(r => console.log(r)).catch(function (err){ console.log(err)});
                    console.log(token);
                    res.render('forgot', {c_email:"", errorMsg:"A password reset link has been sent to your college email address"});
                })
            }
        });
    });


homeRouter.route('/reset')
    .get(function(req,res) {
        Students.findOne({resetHash: req.query.token, resetExpires: {$gt: Date.now()}}, function (err, student){
            if(err) {
                console.log(err);
                return res.redirect('/reset/error');
            }
            if (!student){
                // invalid reset link
                console.log("Reset link is invalid or expired");
                return res.render('forgot', {c_email:"", errorMsg:"Password reset link is invalid or has expired"});
            }
            return res.render('reset');
        })
    })
    .post(async function(req, res) {
        // validate the passwords
        const values = await resetValidator(req.body);
        const retVal = values[0]
        const error = values[1]
        if(!retVal){
            if('password' in error){
                return res.render("reset", { errorMsg: error.password.message });
            }
            else if('confirm_password' in error){
                return res.render("reset", { errorMsg: error.confirm_password.message });
            }
            else{
                return res.render("reset", { errorMsg: "Error in resetting password. Please try again." });
            }
        }

        // validation successful
        // continue here
        Students.findOne({resetHash: req.query.token, resetExpires: {$gt: Date.now()}}, function (err, student){
            if(err){
                console.log(err);
                return res.redirect('/reset/error');
            }
            if (!student) {
                // invalid reset link
                console.log("Password Reset link is invalid or expired");
                //TODO(aditya): Make separate page for this
                return res.render('forgot', {c_email:"", errorMsg:"Password reset link is invalid or has expired"});
            }
            //assume student is already active otherwise wouldn't have got a reset link

            //set new password
            student.setPassword(req.body.password);
            student.resetHash = undefined;
            student.resetExpires = undefined;
            student.save({}, function (err, result){
                if(err){
                    console.log(err);
                    return res.redirect('/reset/error');
                }
                //TODO(aditya): Send an email with password change confirmation
                console.log("Password has been reset");
                return res.redirect('/login');
            })
        })
    });

homeRouter.get("/test", function (req, res) {
    res.sendFile(path.resolve("views/html/index.html"))
});

homeRouter.get('/signup/error', function (req, res){
    res.render('error');
})

homeRouter.get('/verify/error', function (req, res){
    res.render('error');
})

homeRouter.get('/forgot/error', function (req, res){
    res.render('error');
})

homeRouter.get('/reset/error', function (req, res){
    res.render('error');
})

module.exports = homeRouter;
