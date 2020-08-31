const express = require('express');
const homeRouter = express.Router();
const User = require('../../models/userDB.schema');
const path = require('path');

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
    .get(function (req, res) {
        if (req.isAuthenticated())
            res.redirect("/platform");
        else
            res.render("login", { wrongCreds: false });
    })
    .post(function (req, res) {

        const user = new User({
            email: req.body.email,
            password: req.body.password
        });

        req.login(user, function (err) {
            if (err) {
                console.log(err);
                res.render("login", { wrongCreds: true });
            }
            else {
                User.authenticate("local")(req, res, function () {
                    res.redirect("/platform");
                });
            }
        });
    });

homeRouter.route('/signup')
    .get(function (req, res) {
        res.render('signup', { name: "", email: "" });
    })
    .post(function (req, res) {
        console.log(req.body);
        User.register({ email: req.body.c_email }, req.body.password, function (err, user) {
            if (err) {
                console.log(err);
                res.redirect("/signup");
            }
            else {
                console.log(user);
                User.authenticate("local")(req, res, function () {
                    res.redirect("/platform")
                });
            }
        });
    });

homeRouter.get('/logout', function (req, res) {
    req.logout();
    res.redirect("/");
});

homeRouter.get("/test", function (req, res) {
    res.sendFile(path.resolve("views/html/index.html"))
});

module.exports = homeRouter;