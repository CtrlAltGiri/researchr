const professorRouter = require('express').Router();
const projectsRouter = require("./projects");
const projectRouter = require("./project");
const profileRouter = require("./profile");
const passwordRouter = require("./password");
const applicationsRouter = require("./applications");
const applicationRouter = require("./application");

// Check if userType is Professor and only allow professors to access this router.
professorRouter.all("*", function(req, res, next){
    if(req.user.userType === "Professor"){
        next('route');
    }
    else{
        res.status(401).send("Not authorized to access professor details.")
    }
})

// API router to handle(i.e. view project/ add a project) all projects of the professor
professorRouter.use("/projects", projectsRouter);

// API router to view a prof project and to update it if allowed
professorRouter.use("/project", projectRouter);

// API router to view professor's profile and update it
professorRouter.use("/profile", profileRouter);

// API router to update professor password
professorRouter.use("/password", passwordRouter);

// API router to get all applicants for a particular project
professorRouter.use("/applications", applicationsRouter);

// API router to change the status of an applicant for a particular project
professorRouter.use("/application", applicationRouter);

module.exports = professorRouter;
