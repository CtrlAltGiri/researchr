const mongoose = require('mongoose');
const passport = require('passport'), LocalStrategy = require('passport-local');
const Users = mongoose.model('Users');

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
