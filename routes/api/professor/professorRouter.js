const projectsRouter = require("./projects");
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


module.exports = professorRouter;
