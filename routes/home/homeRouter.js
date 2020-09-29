const homeRouter = require('express').Router();
const path = require('path');
const { postLoginStudent , postSignupStudent, getVerifyStudent, postForgotStudent, getResetStudent, postResetStudent } = require('./homeStudent');
const { colleges, branches, yog, degrees } = require('../../client/src/common/data/collegeData')
const { postLoginProfessor, postSignupProfessor, getVerifyProfessor, postForgotProfessor, getResetProfessor, postResetProfessor } = require('./homeProfessor')
const logger = require('../../config/winston');

homeRouter.route("/")
    .get(function (req, res) {
        if (!req.isAuthenticated())
            res.render('homepage');
        else {
            res.redirect('/platform')
        }
})
    .post(function (req, res) {
        if(req.body.type === 'student'){
           res.render('student/signup', {
                name: req.body.name, 
                p_email: req.body.email, 
                colleges: colleges,
                degrees: degrees,
                yogs: yog,
                branches: branches
            });
        }
        else if(req.body.type === 'professor'){
            res.render('professor/signup', { name: req.body.name, p_email: req.body.email, colleges: colleges }) // TODO(giri): Manage dropdowns here and in form vaildator
        }
        else{
            res.redirect('/')
        }
    });

homeRouter.route("/login/:type?")
    .get(function (req, res) {
        if (req.isAuthenticated())
            res.redirect("/platform");
        else
            res.render("login", { wrongCreds: false, unverified: false, professor: true});
    })
    .post(async function (req, res, next) {
        let type = req.params.type;
        if(type === 'student')
            await postLoginStudent(req, res, next);

        else if(type === 'professor')
            await postLoginProfessor(req, res, next);

        else
            res.redirect('/login');
    });

homeRouter.route('/signup/:type?')
    .get(function(req, res){
        let type = req.params.type;
        if(type === 'student')
            res.render('student/signup', {
                name: "", 
                p_email: "", 
                colleges: colleges,
                degrees: degrees,
                yogs: yog,
                branches: branches
            });

        else if(type === 'professor')
            res.render('professor/signup', {colleges: colleges});       // replace this with professor implementation

        else
            res.render('signup')
    })
    .post(async function(req, res){
        let type = req.params.type;
        if(type === 'student')
            await postSignupStudent(req, res);

        else if(type === 'professor')
            await postSignupProfessor(req, res);

        else
            res.redirect('/signup');   
    });

homeRouter.get('/verify/:type',function(req, res){

    let type = req.params.type;
    if(type === 'student')
        getVerifyStudent(req, res);

    else if(type === 'professor')
        getVerifyProfessor(req, res);

    else
        res.render('error')
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
    .post(async function(req, res){
        let type = req.params.type;
        if(type === 'student')
            postForgotStudent(req, res)
            .then(response => logger.ant("%s - Forgot password email successfully sent for %s", req.originalUrl, req.body.c_email))
            .catch(next)
        
        else if(type === 'professor')
            postForgotProfessor(req, res)
            .then(response => logger.ant("%s - Forgot password email successfully sent for %s", req.originalUrl, req.body.c_email))
            .catch(next)

        else
            res.render('error'); 
    });


homeRouter.route('/reset/:type')
    .get(function(req,res) {
        
        let type = req.params.type;
        if(type === 'student')
            getResetStudent(req, res);
        
        else if(type === 'professor')
            getResetProfessor(req, res);
        
        else
            res.render('error');
    })
    .post(async function(req, res) {  
        let type = req.params.type;
        if(type === 'student')
            await postResetStudent(req, res);
        
        else if(type === 'professor')
            await postResetProfessor(req, res);
        
        else
            res.render('error');
    });

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
