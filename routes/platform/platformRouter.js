const express = require('express');
const path = require('path');

const platformRouter = express.Router();

function isProfessor(req, res, next){
    if(req.isAuthenticated() && req.user.userType === "Professor"){
        return next();
    }
    else{
        res.redirect('/login');
    }
}

function isStudent(req, res, next){
    if(req.isAuthenticated() && req.user.userType === "Student"){
        return next();
    }
    else{
        res.redirect('/login');
    }
}

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

platformRouter.get("/professor/*", isProfessor, function(req, res){
    res.sendFile(path.resolve(__dirname, "../..", "client/build/platform.html"));
});

platformRouter.get("/student/*", isStudent, function(req, res){
    res.sendFile(path.resolve(__dirname, "../..", "client/build/platform.html"));
});

platformRouter.get("/platform", routeBasedOnUserType);

module.exports = platformRouter;
