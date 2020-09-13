const studentRouter = require('express').Router();
const applicationsRouter = require('./applications');
const profileRouter = require('./profile');
const projectsRouter = require('./projects');
const projectRouter = require('./project')
const testRouter = require('./test');

// Check if userType is Student and only allow students to access this router.
studentRouter.all("*", function(req, res, next){
    if(req.user.userType === "Student"){
        next('route');
    }
    else{
        res.send(401).send("Not authorized to access student details.")
    }
})

// API router to view and accept / decline applications. Applications are not processed here.
// Student applies for a project in /api/student/project/:projectID
studentRouter.use("/applications", applicationsRouter);

// API router to view and update profile.
studentRouter.use("/profile", profileRouter);

// API router to return all projects at the landing page.
studentRouter.use("/projects", projectsRouter);

// API router to view a project. THIS API is specifically used to apply for a project.
studentRouter.use("/project", projectRouter);

// API router to test new functionalities.
studentRouter.use("/test", testRouter);

module.exports = studentRouter;