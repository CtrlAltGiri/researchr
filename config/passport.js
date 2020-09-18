const passport = require('passport');
const LocalStrategy = require('passport-local');
const Students = require('../models/students');
const Professors = require('../models/professors');

function SessionConstructor(userId, userGroup) {
    this.userId = userId;
    this.userGroup = userGroup;
}

passport.use("local-student", new LocalStrategy({
    usernameField: 'c_email',
    passwordField: 'password',
}, (c_email, password, done) => {
    Students.findOne({ c_email })
        .then((user) => {
            if (!user || !user.validatePassword(password)) {
                return done(null, false, { errors: { 'Email or Password': 'is invalid' } });
            }
            return done(null, user);
        }).catch(done);
}));


passport.use("local-professor", new LocalStrategy({
    usernameField: 'c_email',
    passwordField: 'password',
}, (c_email, password, done) => {
    Professors.findOne({ c_email })
        .then((professor) => {
            if (!professor || !professor.validatePassword(password)) {
                return done(null, false, { errors: { 'Email or Password': 'is invalid' } });
            }
            return done(null, professor);
        }).catch(done);
}));


passport.serializeUser(function (user, done) {

    let userGroup;
    let userPrototype = Object.getPrototypeOf(user);

    if (userPrototype === Students.prototype) {
        userGroup = "Student";
    }
    else if(userPrototype === Professors.prototype){
        userGroup = "Professor";
    }
    else{
        if(process.env.NODE_ENV === 'dev')
            userGroup = user._type
    }

    let sessionConstructor = new SessionConstructor(user._id, userGroup);
    done(null, sessionConstructor);

    // done(null, user._id);
});

passport.deserializeUser(function (sessionConstructor, done) {

    if (sessionConstructor.userGroup === 'Student') {
        Students.findOne({
            _id: sessionConstructor.userId
        },
            function (err, user) {
                user.userType = "Student";
                done(err, user);
            });
    }
    else if (sessionConstructor.userGroup === 'Professor') {
        Professors.findOne({
            _id: sessionConstructor.userId
        },
            function (err, user) {
                user.userType = "Professor";
                done(err, user);
            });
    }

    /*Students.findById(sessionConstructor, function (err, user) {
        done(err, user);
    });*/
})


module.exports = passport;
