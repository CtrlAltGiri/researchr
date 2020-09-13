const platformRouter = require('express').Router();

function routeBasedOnUserType(req, res, next){
    if(req.isAuthenticated()){
        if(req.user.userType === "Student"){
            res.redirect("/student")
        }
        else if(req.user.userType === "Professor"){
            res.redirect("/professor");
        }
    }
    else{
        res.redirect("/login");
    }
}

platformRouter.get("/", routeBasedOnUserType);

module.exports = platformRouter;
