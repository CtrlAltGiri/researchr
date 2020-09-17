// Contains API to view a specific application
const applicationRouter = require('express').Router();
const mongoose = require('mongoose');
const Applications = require("../../../models/applications");
const ProfProjects = require('../../../models/profProjects');
const Async = require('async');

applicationRouter.route('/:projectID')
    // API to view a specific applications
    .get(function (req, res){

        let studentID = req.user._id;
        let projectID = req.params.projectID;

        Async.waterfall([
            function (callback) {
                // STEP 1: Get the required project from profProjects to get the questionnaire variable
                ProfProjects.findOne({_id: projectID}, function (err, project){
                    if(err) {
                        console.log(err);
                        callback("Failed");
                    }
                    else if(!project) {
                        console.log("No project found");
                        callback("Failed");
                    }
                    else {
                        callback(null, project.questionnaire);
                    }
                })
            },
            function (questionnaire, callback) {
                // STEP 2: Find the required application from the applications collection
                Applications.findOne({_id: studentID, 'profApplications.projectID': projectID}, function (err, applications) {
                    if (err) {
                        console.log(err);
                        callback("Failed");
                    }
                    else if(!applications) {
                        console.log("No such application exists");
                        callback("Application not found");
                    }
                    else {
                        let application = applications.profApplications.find(function (element){
                            return element.projectID.equals(mongoose.Types.ObjectId(projectID));
                        })
                        // sanity check
                        if (!application) {
                            console.log("Should not happen");
                            callback("Failed");
                        }
                        else {

                            application.questionnaire = questionnaire;
                            callback(null, application);
                        }

                    }
                })
            }
        ], function (err, application){
            if(err) {
                return res.status(404).send(err);
            }
            else {
                // filter out information to send to the front end
                application = (({sop, answers, questionnaire}) => ({sop, answers, questionnaire}))(application);
                return res.status(200).send(application);
            }
        })

    })

module.exports = applicationRouter;
