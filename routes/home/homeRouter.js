const homeRouter = require('express').Router();
const Students = require('../../models/students');
const path = require('path');
const passport = require('../../config/passport');
const { sendVerificationEmail } = require('../../utils/email/sendgirdEmailHelper'); 
const { signUpValidator } = require('../../utils/formValidators/signup');

homeRouter.route("/").get(function (req, res) {
    if (!req.isAuthenticated())
        res.render('homepage');
    else {
        res.redirect('/platform')
    }
}).post(function (req, res) {
        res.render('signup', { name: req.body.name, p_email: req.body.email });
    });

homeRouter.route("/login")
    .get(function (req, res) {
        if (req.isAuthenticated())
            res.redirect("/platform");
        else
            res.render("login", { wrongCreds: false, unverified: false });
    })
    .post(function (req, res, next) {
        passport.authenticate('local', {}, function (err, user, info) {
            if(err){ 
                console.log(err);
                return next(err);
            }
            if(!user){
                console.log("NOT FOUND");
                console.log(info);
                return res.render("login", { wrongCreds: true, unverified: false });
            }
            // check if user is active i.e. college email id is verified or not
            if(!user.active){
                return res.render("login", { wrongCreds: false, unverified: true });
            }
            req.logIn(user, function (err) {
                if(err){
                    console.log(err);
                    return next(err); 
                }

                return res.redirect('/platform');
            });
        })(req, res, next);
    });

homeRouter.route('/signup')
.get(function(req,res){
    res.render('signup', {name: "", p_email: ""});
})
.post(async function(req, res){

    const retVal = await signUpValidator(req.body);  
    if(!retVal){
        res.render('signup', {name:"", p_email:"", errorMsg:"Please ensure all fields are entered correctly."})
        return;
    }

    // check if email is already registered in the database
    //TODO(aditya): Write this logic in a better way
    Students.findOne({'c_email': req.body.c_email}, function(err, result) {
        if (err){
            console.log(err);
            return;
        }
        // return back to signup page and highlight email box saying email is already in use
        if(result && result.active){
            //TODO(aditya)
            return res.end("<h1>Email has already been registered with us</h1>");
        }
        // if email verification has not been done, remove existing doc in collection and allow signup again
        else if(result){
            Students.deleteOne({ _id: result._id}, function(err, obj) {
                if(err){
                    console.log("Failed to remove entry from collection")
                    console.log(err);
                    //TODO(aditya): Handle error properly
                    return res.render('signup', {name: "", p_email: ""});
                }
                console.log("1 document deleted");
            });
        }
        // add user to database
        const finalUser = new Students({
            c_email: req.body.c_email,
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
                // res.json({ user: finalUser.toAuthJSON() });
                //TODO(aditya): Make a webpage for this. Maybe with a resend verification link?
                res.end("<h1>A verification link has been sent to your college email id. Please verify it to continue to our platform.</h1>");
            });
    });
});

homeRouter.get('/verify',function(req,res){
    Students.findOne({ verifyHash:  req.query.token})
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
            //TODO(aditya): remove verifyHash from document once a user is verified
            Students.findByIdAndUpdate(
                {_id: user._id},
                {
                    $unset: {verifyHash: 1},
                    $set: {active: true}
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
            return res.redirect('/platform');
        })
});

homeRouter.get('/logout', function (req, res) {
    req.logout();
    res.redirect("/");
});

homeRouter.get("/test", function (req, res) {
    res.sendFile(path.resolve("views/html/index.html"))
});

module.exports = homeRouter;
