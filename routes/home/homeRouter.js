const homeRouter = require('express').Router();
const Students = require('../../models/students');
const path = require('path');
const passport = require('../../config/passport');
const { resetValidator } = require("../../utils/formValidators/reset");
const { forgotValidator } = require("../../utils/formValidators/forgot");
const { sendPasswordResetEmail } = require('../../utils/email/sendgirdEmailHelper');
const Async = require('async');
const { postLoginStudent , postSignupStudent, getVerifyStudent, postForgotStudent, getResetStudent, postResetStudent } = require('./homeStudent');

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
            res.render('student/signup', { name: req.body.name, p_email: req.body.email });
        }
        else if(req.body.type === 'professor'){
            res.render('professor/signup', { name: req.body.name, p_email: req.body.email })
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
            res.render("login", { wrongCreds: false, unverified: false });
    })
    .post(async function (req, res, next) {
        let type = req.params.type;
        if(type === 'student')
            postLoginStudent(req, res, next);

        else if(type === 'professor')
            res.redirect('/login');     // replace this with professor implementation.

        else
            res.redirect('/login');
    });

homeRouter.route('/signup/:type?')
    .get(function(req, res){
        let type = req.params.type;
        if(type === 'student')
            res.render('student/signup', {name: "", p_email: ""});

        else if(type === 'professor')
            res.render('signup');       // replace this with professor implementation

        else
            res.render('signup')
    })
    .post(async function(req, res){
        let type = req.params.type;
        if(type === 'student')
            postSignupStudent(req, res)

        else if(type === 'professor')
            res.redirect('/signup');    // replace this with professor implementation

        else
            res.redirect('/signup');   
    });

homeRouter.get('/verify/:type',function(req, res){

    let type = req.params.type;
    if(type === 'student')
        getVerifyStudent(req, res)

    else if(type === 'professor')
        res.render('homepage')      // replace this with professor implementation
    
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
            postForgotStudent(req, res);
        
        else if(type === 'professor')
            res.render('homepage')      //replace this with professor implementation

        else
            res.render('error');
    });


homeRouter.route('/reset/:type')
    .get(function(req,res) {
        
        let type = req.params.type;
        if(type === 'student')
            getResetStudent(req, res);
        
        else if(type === 'professor')
            res.render('homepage')      // replace this with professor implementation
        
        else
            res.render('error');
    })
    .post(async function(req, res) {  
        let type = req.params.type;
        if(type === 'student')
            postResetStudent(req, res);
        
        else if(type === 'professor')
            res.render('homepage')      // replace this with professor implementation
        
        else
            res.render('error');
    });

///  LOGOUT ROUTE

homeRouter.get('/logout', function (req, res) {
    req.logout();
    res.redirect("/");
});

////////   TEST APIs

homeRouter.get("/test", function (req, res) {
    res.sendFile(path.resolve("views/html/login.html"))
});

homeRouter.get('/plsauthenticate', function(req, res){
    if(process.env.NODE_ENV === 'dev'){
        const user = {
           _id : '5f5b66197600e40b9c52f2a4'
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
