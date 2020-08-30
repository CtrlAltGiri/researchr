const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
// const passport = require('passport');
require('./models/Users');
const Users = mongoose.model('Users');
require('dotenv').config();
const cors = require('cors')
// const LocalStrategy = require('passport-local');

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
var passport = require('passport'), LocalStrategy = require('passport-local');
app.use(passport.initialize(undefined));
app.use(passport.session(undefined));

// Use this strategy for login authentication
passport.use("local", new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, (email, password, done) => {
    // find user (specified by unique email address)
    Users.findOne({ email })
        .then((user) => {
            if(!user || !user.validatePassword(password)) {
                // invalid user or password
                return done(null, false, { errors: { 'email or password': 'is invalid' } });
            }
            // valid user and password
            return done(null, user);
        }).catch(done);
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    Users.findById(id, function(err, user) {
        done(err, user);
    });
})

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

app.route("/login")
.get(function(req, res){
    if(req.isAuthenticated())
        res.redirect("/platform");
    else
        res.render("login", {wrongCreds: false});
})
.post(function(req,res, next){
    passport.authenticate('local', {}, function(err, user, info) {
        if (err) { console.log(err);return next(err); }
        if (!user) { return res.render("login", {wrongCreds: true}); }
        req.logIn(user, function(err) {
            if (err) { console.log(err);return next(err); }
            return res.redirect('/platform');
        });
    })(req, res, next);
});

app.route('/signup')
.get(function(req,res){
    res.render('signup', {name: "", email: ""});
})
.post(function(req, res){
    console.log(req.body);
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

    const finalUser = new Users({
        email: req.body.c_email,
        password: req.body.password
    });

    finalUser.setPassword(req.body.password);

    // add user to database
    return finalUser.save()
        .then(() => res.json({ user: finalUser.toAuthJSON() }));
});

app.route('/platform')
.get(function(req, res){
    if(req.isAuthenticated()){
        res.sendFile(__dirname + "\\client\\build\\platform.html");
    }
    else{
        res.render("login", {wrongCreds: false});
    }
});

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

app.listen(PORT, function(){
    console.log('Server started on port ' + PORT);
});
