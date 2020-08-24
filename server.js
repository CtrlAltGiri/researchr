const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const User = require('./models/userDB.schema');
require('dotenv').config();
const cors = require('cors')

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

mongoose.connect("mongodb://localhost:27017/userDB", { useUnifiedTopology: true, useNewUrlParser: true });
mongoose.set("useCreateIndex", true);

app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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
.post(function(req,res){
    
    // req.body.remember_me.
    const user = new User({
        email : req.body.email,
        password: req.body.password
    });

    req.login(user, function(err){
        if(err){
            console.log(err);
            res.render("login", {wrongCreds: true});
        }
        else{
            User.authenticate("local")(req, res, function(){
                res.redirect("/platform");
            });
        }
    });
});

app.route('/signup')
.get(function(req,res){
    res.render('signup', {name: "", email: ""});
})
.post(function(req, res){
    console.log(req.body);
    User.register({email: req.body.c_email}, req.body.password, function(err, user){
        if(err){
            console.log(err);
            res.redirect("/signup");
        }
        else{
            console.log(user);
            User.authenticate("local")(req, res, function(){
                console.log("Authenticated");
                res.redirect("/platform")
            });
        }
    });
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
    res.render('homepage')
});

app.get("/passwords", cors(), function(req, res){
    let a = ["giri","bala", "radhi"];
    res.json(a);
});

app.listen(PORT, function(){
    console.log('Server started on port ' + PORT);
});