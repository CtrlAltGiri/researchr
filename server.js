const router = require('./routes/router');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const crypto = require('crypto');
require('./models/Users');
require('./config/passport');
require('dotenv').config();
const cors = require('cors')
const passport = require("passport");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public/"));
app.use(express.static("client/build"))

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

mongoose.connect(process.env.DB_URL, { useUnifiedTopology: true, useNewUrlParser: true });
mongoose.set("useCreateIndex", true);
const Users = mongoose.model('Users');

app.use(passport.initialize(undefined));
app.use(passport.session(undefined));

// sendgrid for sending emails
const sendGrid = require('sendgrid').mail;
const { sendVerificationEmail } = require('./email/SendGridEmailHelper');

// Initial route
app.route("/").get(function(req, res){
    if(!req.isAuthenticated())
        res.render('homepage');
    else{
        res.redirect('/platform')
    }
})
.post(function(req, res){
    res.render('signup', {name: req.body.name, email:req.body.email});
});

// Login route
app.route("/login")
.get(function(req, res){
    if(req.isAuthenticated())
        res.redirect("/platform");
    else
        res.render("login", {wrongCreds: false});
})
.post(function(req,res, next){
    passport.authenticate('local', {}, function(err, user, info) {
        if (err) {
            console.log(err);
            return next(err);
        }
        if (!user) {
            console.log(info);
            return res.render("login", {wrongCreds: true});
        }
        req.logIn(user, function(err) {
            if (err) {
                console.log(err);
                return next(err);
            }
            return res.redirect('/platform');
        });
    })(req, res, next);
});

// Signup route
app.route('/signup')
.get(function(req,res){
    res.render('signup', {name: "", email: ""});
})
.post(function(req, res){
    // console.log(req.body);
    if(!req.body.c_email) {
        return res.status(422).json({
            errors: {
                email: 'is required',
            },
        });
    }

    if(!req.body.password) {
        return res.status(422).json({
            errors: {
                password: 'is required',
            },
        });
    }

    // check if email is already registered in the database
    //TODO(aditya): Write this logic in a better way
    Users.findOne({'email': req.body.c_email}, function(err, result) {
        if (err){
            console.log(err);
            return;
        }
        if(result && result.active){
            return res.end("<h1>Email has already been registered with us</h1>");
        }
        // if email verification has not been done
        else if(result){
            //TODO(aditya): Add functionality to allow user to signup again/send verification link again
            return res.end("<h1>Email has been registered but only needs to be verified</h1>");
        }
        // if email is not already in database, add new user to database
        else {
            const finalUser = new Users({
                email: req.body.c_email,
                password: req.body.password,
                active: false
            });

            // set password
            finalUser.setPassword(req.body.password);

            // set verification hash and get the token for email
            let token = finalUser.setVerifyHash();

            // add user to database and send a verification email
            return finalUser.save()
                .then(() => {
                    //TODO(aditya): Not sure what to do with the 'r' here
                    sendVerificationEmail(req.body.c_email, req.body.name, token).then(r => console.log("promise", r));
                    res.json({ user: finalUser.toAuthJSON() });
                });
        }
    });
});

// Platform route
app.route('/platform')
.get(function(req, res){
    if(req.isAuthenticated()){
        res.sendFile(__dirname + "\\client\\build\\platform.html");
    }
    else{
        res.render("login", {wrongCreds: false});
    }
});

// Logout
app.get('/logout', function(req, res){
    req.logout();
    res.redirect("/");
});

app.get("/test", function(req, res){
    res.sendFile(__dirname + "/views/html/index.html")
});

app.get("/passwords", cors(), function(req, res){
    let a = [{category: ["#ComputerVision", "#Machine Learning"],
            name: "Extensive Analysis on Human Brain Signals with Machine Learning", 
            desc:"The project has been under works since the beginning of the 19th centry. Dr PBS has been working on this since 20th century and I intend to complete it before the end of this world.", 
            profName:"Dr. Bhagath Singh", 
            profDesignation:"Assistant Professor", 
            views:"1.2k",
            comments:"10"},
            {category: ["#Software Engineering", "#Web Development"],
            name: "API capturing algorithm to detect the presence of alien life near sector 7", 
            desc:"The project has been under works since the beginning of the 19th centry. Dr PBS has been working on this since 20th century and I intend to complete it before the end of this world.", 
            profName:"Dr. Giridhar Balachandran", 
            profDesignation:"Senior Professor", 
            views:"120.2M",
            comments:"70"}
        ];
    res.json(a);
});


// Email verification functionality
app.get('/verify',function(req,res){
    Users.findOne({ verifyHash:  req.query.token})
        .then((user) => {
            if(!user) {
                // invalid verify link
                console.log("Invalid verification link");
                res.end("<h1>Bad Request</h1>");
                return;
            }
            if(user && user.active) {
                console.log("Email has already been verified");
                res.end("<h1>Already verified</h1>");
                return;
            }
            // link verified for user
            Users.findByIdAndUpdate(
                {_id: user._id},
                {
                    "active": true
                },
                { useFindAndModify: false },
                function(err, result){
                    if(err){
                        res.send(err)
                    }
                    else{
                        console.log(result)
                    }
                })
            console.log("Email has been verified");
            res.end("<h1>Email has been Successfully verified");
        })
});

app.listen(PORT, function(){
    console.log('Server started on port ' + PORT);
});
