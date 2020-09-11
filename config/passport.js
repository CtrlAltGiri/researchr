const passport = require('passport');
const LocalStrategy = require('passport-local');
const Students = require('../models/students');

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

/*

passport.use("local-professor", new LocalStrategy({
    username: 'c_email',
    passwordField: 'password',
}, (c_email, password, done) => {

    Professor.findOne({c_email})
        .then((professor) => {
            if(!professor || !professor.validatePassword(password)){
                return done(null, false);
            }
            return done(null, user);
        }).catch(done);
}));

*/


passport.serializeUser(function (user, done) {

    /*
        let userGroup;
        let userPrototype = Object.getPrototypeOf(user);

        if(userPrototype === Student.prototype){
            userGroup = "Student";
        }
        else{
            userGroup = "Professor";
        }

        let sessionConstructor = new SessionConstructor(user._id, userGroup);
        done(null, sessionConstructor);
    */

    done(null, user._id);
});

passport.deserializeUser(function (sessionConstructor, done) {

    /*
    if (sessionConstructor.userGroup === 'Student') {
        Student.findOne({
            _id: sessionConstructor.userId
        }, 
        function (err, user) { 
            user.userType = "Student";
            done(err, user);
        });
    }
    else if(sessionConstructor.userGroup === 'Professor'){
        Professor.findOne({
            _id: sessionConstructor.userId
        },
        function (err, user) { 
            user.userType = "Professor";
            done(err, user);
        });
    }
    */

    Students.findById(sessionConstructor, function (err, user) {
        done(err, user);
    });
})


module.exports = passport;
