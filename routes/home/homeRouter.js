const homeRouter = require('express').Router();
const path = require('path');
const { postLoginStudent , postSignupStudent, getVerifyStudent, postForgotStudent, getResetStudent, postResetStudent } = require('./homeStudent');
const { colleges, branches, yog, degrees, yos, branchValues, yosValues } = require('../../client/src/common/data/collegeData');
const { collegeList, collegeNames } = require('../../client/src/common/data/collegeList');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const { postLoginProfessor, postSignupProfessor, getVerifyProfessor, postForgotProfessor, getResetProfessor, postResetProfessor } = require('./homeProfessor')
const { sendContactUsEmail } = require('../../utils/email/sendgirdEmailHelper');
const WaitingList = require('../../models/waitingList');
const logger = require('../../config/winston');

homeRouter.route("/")
    .get(function (req, res) {
        if (!req.isAuthenticated()) {
            res.render('homepage');
        }
        else {
            res.redirect('/platform');
        }
})
    .post(function (req, res) {
        if(req.body.type === 'student') {
            if(process.env.BLOCK_STUDENT_SIGNUP === "true") {
                // check if req.body.email a valid email
                if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(req.body.email))
                {
                   // valid email ; store it in waitingList collection
                    WaitingList.updateOne({email: req.body.email}, {$set: {addedAt: Date.now()}}, {upsert: true}, function (err, result) {
                        if(err) {
                            logger.tank(err);
                        }
                        // TODO(aditya): What to do if it fails?
                    })
                }
                return res.redirect('/landingpage/' + req.body.email);
            }
            else {
                res.render('student/signup', {
                    name: req.body.name,
                    p_email: req.body.email,
                    colleges: colleges,
                    degrees: degrees,
                    yogs: yog,
                    branches: branches
                });
            }
        }
        else if(req.body.type === 'professor') {
            if(process.env.BLOCK_PROFESSOR_SIGNUP === "true") {
                return res.redirect('/landingpage/' + req.body.email);
            }
            else {
                // TODO(giri): Manage dropdowns here and in form vaildator
                res.render('professor/signup', { name: req.body.name, p_email: req.body.email, colleges: colleges });
            }
        }
        else {
            res.redirect('/');
        }
    });

homeRouter.route("/landingpage/:email?")
    .get(function(req, res){
        let email = req.params.email;
        if(email === "complete"){
            res.render("landingPage",
                {done: "Details submitted successfully!", departments: branches, yoss:yos, collegeList: collegeList })
        }
        else{
            res.render("landingPage",
                { email: req.params.email, departments: branches, yoss:yos, collegeList: collegeList });
        }
    })
    // adds information to the waiting list collection
    .post(function(req, res){
        let email = req.body.email.replace('$', '_').replace('{', '_').replace('}', '_');
        let name = req.body.name.replace('$', '_').replace('{', '_').replace('}', '_');
        let type = req.body.type.replace('$', '_').replace('{', '_').replace('}', '_');
        let from = req.body.from.replace('$', '_').replace('{', '_').replace('}', '_');
        let department = req.body.department.replace('$', '_').replace('{', '_').replace('}', '_');
        let year = req.body.yos.replace('$', '_').replace('{', '_').replace('}', '_');
        let college = req.body.college.replace('$', '_').replace('{', '_').replace('}', '_');

        if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(req.body.email) &&
            (name && typeof name === 'string' && name.length < 500) &&
            (type && typeof type === 'string' && type.length < 500) &&
            (from && typeof from === 'string' && from.length < 500) &&
            (college && typeof college === 'string' && college.length < 1000 && college in collegeNames) &&
            (branchValues.find(b => department)) &&
            (yosValues.find(b => year))) {
            WaitingList.updateOne(
                {email: email},
                {
                    $set: {
                        addedAt: Date.now(),
                        name: name,
                        type: type,
                        from: from,
                        department: department,
                        yos: year,
                        college: collegeNames[college]
                    }
                },
                {upsert: true},
                function (err, result) {
                    if(err) {
                        logger.tank(err);
                        return res.render("landingPage", {
                            errorMsg: "There was an error in requesting access. Please try again later.",
                            departments: branches, yoss:yos, collegeList: collegeList});
                    }
                    // TODO(aditya): What to do if it fails?
                    else {
                        if(type === 'student') {
                            return res.render("landingPage",
                                {done: "student", departments: branches, yoss:yos, collegeList: collegeList});
                        }
                        else {
                            return res.render("landingPage",
                                {done: "professor", departments: branches, yoss:yos, collegeList: collegeList});
                        }
                    }
            })
        }
        else {
            return res.render("landingPage",
                {errorMsg: "Please enter all fields correctly.",
                    departments: branches, yoss:yos, collegeList: collegeList});
        }
    })

homeRouter.route("/login/:type?")
    .get(function (req, res) {
        if (req.isAuthenticated())
            res.redirect("/platform");
        else
            res.render("login", { wrongCreds: false, unverified: false, professor: true});
    })
    .post(function (req, res, next) {
        let type = req.params.type;
        if(type === 'student')
            postLoginStudent(req, res, next)
                .then(response => logger.ant("Successfully called student login API"))
                .catch(next);

        else if(type === 'professor')
            postLoginProfessor(req, res, next)
                .then(response => logger.ant("Successfully called professor login API"))
                .catch(next);

        else
            res.redirect('/login');
    });

homeRouter.route('/signup/:type?')
    .get(function(req, res){
        let type = req.params.type;
        if(type === 'student') {
            if(process.env.BLOCK_STUDENT_SIGNUP === "true") {
                return res.redirect('/landingpage/');
            }
            else {
                res.render('student/signup', {
                    name: "",
                    p_email: "",
                    colleges: colleges,
                    degrees: degrees,
                    yogs: yog,
                    branches: branches
                });
            }
        }

        else if(type === 'professor') {
            if(process.env.BLOCK_PROFESSOR_SIGNUP === "true") {
                return res.redirect('/landingpage/');
            }
            else {
                res.render('professor/signup', {colleges: colleges});       // replace this with professor implementation
            }
        }

        else
            res.render('landingPage');
    })
    .post(function(req, res, next){
        let type = req.params.type;
        if(type === 'student') {
            if(process.env.BLOCK_STUDENT_SIGNUP === "true") {
                return res.status(StatusCodes.NOT_FOUND).send("<h1>NOT FOUND</h1>");
            }
            else {
                postSignupStudent(req, res)
                    .then(response => logger.ant("Successfully called student signup API"))
                    .catch(next);
            }
        }

        else if(type === 'professor') {
            if(process.env.BLOCK_PROFESSOR_SIGNUP === "true") {
                return res.status(StatusCodes.NOT_FOUND).send("<h1>NOT FOUND</h1>");
            }
            else {
                postSignupProfessor(req, res)
                    .then(response => logger.ant("Successfully called professor signup API"))
                    .catch(next);
            }
        }


        else
            res.redirect('/signup');
    });

homeRouter.get('/verify/:type?',function(req, res){

    let type = req.params.type;
    if(type === 'student')
        getVerifyStudent(req, res);

    else if(type === 'professor')
        getVerifyProfessor(req, res);
    else
        res.render('error');
});

// router for forgot password flow
homeRouter.route('/forgot/:type?')
    .get(function(req, res){
        let type = req.params.type;
        if(!type || !(type === 'student' || type === 'professor'))
            res.render('error');
        else
            res.render('forgot', {c_email: "", type:type});
    })
    .post(function(req, res, next){
        let type = req.params.type;
        if(type === 'student')
            postForgotStudent(req, res)
            .then(response => logger.ant("Successfully called forgot password API for student"))
            .catch(next);
        
        else if(type === 'professor')
            postForgotProfessor(req, res)
            .then(response => logger.ant("Successfully called forgot password API for professor"))
            .catch(next);

        else
            res.render('error'); 
    });


homeRouter.route('/reset/:type?')
    .get(function(req,res) {
        
        let type = req.params.type;
        if(type === 'student')
            getResetStudent(req, res);
        
        else if(type === 'professor')
            getResetProfessor(req, res);
        
        else
            res.render('error');
    })
    .post(function(req, res, next) {
        let type = req.params.type;
        if(type === 'student')
            postResetStudent(req, res)
                .then(response => logger.ant("Successfully called reset password API for student"))
                .catch(next);
        
        else if(type === 'professor')
            postResetProfessor(req, res)
                .then(response => logger.ant("Successfully called reset password API for professor"))
                .catch(next);
        
        else
            res.render('error');
    });

// Route to handle any contact messages from home page
homeRouter.post('/contactus', function (req, res){
    sendContactUsEmail(req.body.name, req.body.email, req.body.message)
        .then(r => {
            logger.ant("Sent a ContactUs email successfully");
            return res.render('homepage', {response: "Your message has been recorded successfully"});
        })
        .catch(function (err) {
            logger.tank(err);
            return res.render('homepage',
                {response: "Sorry there was an error in recording your message. " +
                        "Please try again later or contact us using the contact details provided."})
        });
})

///  LOGOUT ROUTE

homeRouter.get('/logout', function (req, res) {
    req.logout();
    res.redirect("/");
});

// DEFAULT ROUTE
homeRouter.all(function(req, res){
    next(new Error("Invalid route"))
})

////////   TEST APIs

homeRouter.get("/test", function (req, res) {
    res.sendFile(path.resolve("views/html/login.html"))
});

homeRouter.get('/plsauthenticate/:type', function(req, res){

    const type = req.params.type;
    const id = type === 'Student' ? '5f52765205ae1e5620e10c5e': '5f6273f9f49bf96ebc3662ad';
    if(process.env.NODE_ENV === 'dev'){
        const user = {
           _id : id,
           _type: type
        }
        req.logIn(user, function (err) {
            if(err){
                console.log(err);
                return;
            }
            console.log("Dev authenticated");
            res.send("done");
        })
    }
})

module.exports = homeRouter;
