const projectsRouter = require('express').Router()
const ProfProjects = require('../../../models/profProjects');

// API to show all projects on the main platform page to the students
projectsRouter.route("/")
    .get(function (req, res) {
        // query all prof projects with application close date > cur date
        ProfProjects.find({applicationCloseDate: {$gt: Date.now()}}, function (err, projects){
            if(err){
                console.log(err);
                return res.status(404).send("Failed");
            }
            // send all projects to front end
            return res.status(200).send(projects);
        })
    })

module.exports = projectsRouter;