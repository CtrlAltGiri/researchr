const express = require('express');
const homeRouter = express.Router();
const Users = require('../../models/Users');
const path = require('path');
const passport = require('../../models/auth');

homeRouter.route("/").get(function (req, res) {
    if (!req.isAuthenticated())
        res.render('homepage');
    else {
        res.redirect('/platform')
    }
})
    .post(function (req, res) {
        res.render('signup', { name: req.body.name, email: req.body.email });
    });

homeRouter.route("/login")
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


homeRouter.route('/signup')
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

    return finalUser.save()
        .then(() => res.json({ user: finalUser.toAuthJSON() }));
});

homeRouter.get('/logout', function (req, res) {
    req.logout();
    res.redirect("/");
});

homeRouter.get("/test", function (req, res) {
    res.sendFile(path.resolve("views/html/index.html"))
});

module.exports = homeRouter;