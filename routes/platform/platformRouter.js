const platformRouter = require('express').Router();
const path = require('path');

/*

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

*/

function routeBasedOnUserType(req, res, next){
    res.redirect("/student");
}

platformRouter.get("/", routeBasedOnUserType);

module.exports = platformRouter;
