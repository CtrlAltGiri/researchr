const projectsRouter = require("./projects");
const projectRouter = require("./project");
const profileRouter = require("./profile");
const professorRouter = require('express').Router()

// Check if userType is Professor and only allow professors to access this router.
professorRouter.all("*", function(req, res, next){
    if(req.user.userType === "Professor"){
        next('route');
    }
    else{
        res.send(401).send("Not authorized to access professor details.")
    }
})

// API router to handle(i.e. view project/ add a project) all projects of the professor
professorRouter.use("/projects", projectsRouter);

// API router to view a prof project and to update it if allowed
professorRouter.use("/project", projectRouter);

// API router to view professor's profile and update it
professorRouter.use("/profile", profileRouter);

module.exports = professorRouter;
