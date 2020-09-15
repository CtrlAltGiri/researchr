const projectsRouter = require('express').Router()
const ProfProjects = require('../../../models/profProjects');

// API to show all projects on the main platform page to the students
projectsRouter.route("/")
    .get(function (req, res) {
        console.log("Here")
        // following variable decides if college view is to be shown or a normal view is to be shown to the viewer
        let showAllProjects = req.query.allProjects
        // get student's college name from req
        let studentCollege = req.user.college

        // construct the filter query
        let filter = {applicationCloseDate: {$gt: Date.now()}}

        if(showAllProjects === "false"){
            filter.college = studentCollege;
        }

        // query all prof projects with application close date > cur date and based on the view
        ProfProjects.find(filter, function (err, projects){
            if(err){
                console.log(err);
                return res.status(404).send("Failed");
            }
            else{
                // filter all restricted projects that are not in same college
                projects = projects.filter(function (element){
                    return (element.restrictedView !== true || (element.restrictedView === true && element.college === studentCollege));
                })

                // send all projects to front end
                return res.status(200).send(projects);
            }

        })
    })

module.exports = projectsRouter;