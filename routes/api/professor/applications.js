const applicationsRouter = require('express').Router();
const ProfProjects = require("../../../models/profProjects");
const Applications = require("../../../models/applications");
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const ObjectID = require("bson-objectid");
const Async = require('async');
const logger = require('../../../config/winston');

// API to get all applications for a particular project
applicationsRouter.route("/:projectID")
    .get(function (req,res){
        // get the professor ID from req
        let professorID = req.user._id;
        // get projectID from req params
        let projectID = req.params.projectID;
        // check if its a valid object id
        if(!ObjectID.isValid(projectID)){
            return res.status(StatusCodes.BAD_REQUEST).send("Invalid URL");
        }

        // find all applicants
        Async.waterfall([
            function (callback) {
                // STEP 1: Check if the project ID and professor ID is present in the profProjects collection
                ProfProjects.findOne({_id: projectID, professorID: professorID}, function (err, project){
                    if(err) {
                        logger.tank(err);
                        callback("Failed");
                    }
                    else if(!project) {
                        logger.ant("No project found with id %s", projectID);
                        callback("Invalid URL");
                    }
                    else {
                        callback(null, project);
                    }
                })
            },
            function (project, callback) {
                // STEP 2: Find all applicants for the project
                Applications.find({'profApplications.projectID': projectID}, {'profApplications.$':1, name:2, college:3, branch:4},
                    function (err, applications){
                    if(err) {
                        logger.tank(err);
                        callback("Failed");
                    }
                    else if(!applications) {
                        logger.tank("Failed to get applications for project: %s", projectID);
                        callback("Failed");
                    }
                    else {
                        // object to be returned
                        let applicants = {};
                        applicants.name = project.name;
                        applicants.questionnaire = project.questionnaire;
                        // all active applications
                        applicants.active = [];
                        // all interview/selected applications
                        applicants.selected = [];
                        // all completed/ongoing applications
                        applicants.ongoing = [];
                        // all cancelled/rejected/declined applications
                        applicants.archived = [];

                        applications.forEach(function (element) {
                            // sanity check
                            if(element.profApplications.length <=0) {
                                logger.soldier("No applications in element for student: %s", element._id);
                                return;
                            }
                            let toAdd = {
                                studentID: element._id,
                                name: element.name,
                                college: element.college,
                                branch: element.branch,
                                cgpa: element.profApplications[0].cgpa,
                                status: element.profApplications[0].status,
                                answers: element.profApplications[0].answers,
                                sop: element.profApplications[0].sop
                            };
                            switch(element.profApplications[0].status)
                            {
                                case "active":
                                    applicants.active.push(toAdd);
                                    break;
                                case "selected":
                                case "interview":
                                    applicants.selected.push(toAdd);
                                    break;
                                case "completed":
                                case "ongoing":
                                    applicants.ongoing.push(toAdd);
                                    break;
                                case "cancelled":
                                case "declined":
                                case "rejected":
                                    applicants.archived.push(toAdd);
                                    break;
                                default:
                                    logger.soldier("Invalid application status found for student: %s", element._id);
                            }
                        });
                        callback(null, applicants);
                    }
                })
            }
        ], function (err, applicants){
            if(err) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
            }
            else {
                return res.status(StatusCodes.OK).send(applicants);
            }
        })

    })

module.exports = applicationsRouter;
