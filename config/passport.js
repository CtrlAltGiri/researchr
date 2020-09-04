const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoose = require('mongoose');
const Students = require('../models/students');

passport.use("local", new LocalStrategy({
    usernameField: 'c_email',
    passwordField: 'password',
}, (c_email, password, done) => {
    Students.findOne({ c_email })
        .then((user) => {
            if(!user || !user.validatePassword(password)) {
                return done(null, false, { errors: { 'email or password': 'is invalid' } });
            }
            return done(null, user);
        }).catch(done);
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    Students.findById(id, function(err, user) {
        done(err, user);
    });
})

module.exports = passport;
