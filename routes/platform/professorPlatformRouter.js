const platformRouter = require('express').Router();
const path = require('path');

function isProfessor(req, res, next){
    if(req.isAuthenticated() && req.user.userType === "Professor"){
        return next();
    }
    else{
        res.redirect('/login');
    }
}

platformRouter.get("/*" , /*isProfessor,*/ function(req, res){
    res.sendFile(path.resolve(__dirname, "../..", "client/build/platform.html"));
});

module.exports = platformRouter;