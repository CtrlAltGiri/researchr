const studentPlatformRouter = require('express').Router();
const path = require('path');

function isStudent(req, res, next){
    if(req.isAuthenticated() && req.user.userType === "Student"){
        return next();
    }
    else{
        if(/\/student\/profile\/.+/.test(req.originalUrl))
            res.redirect('/external' + req.originalUrl);
        else
            res.redirect('/login');
    }
}

studentPlatformRouter.get("/*", isStudent, function(req, res){
    res.sendFile(path.resolve(__dirname, "../..", "client/build/platform.html"));
});


module.exports = studentPlatformRouter