// Contains API to view a specific application
const applicationRouter = require('express').Router();
const mongoose = require('mongoose');
const Applications = require("../../../models/applications");
const ProfProjects = require('../../../models/profProjects');
const Async = require('async');
const student = require('../message/student');

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
                        logger.tank(err);
                        callback("Failed");
                    }
                    else if(!project) {
                        logger.tank("No project found - Student: %s - Project %s", studentID, projectID);
                        callback("Failed");
                    }
                    else {
                        callback(null, project.questionnaire);
                    }
                })
            },
            function (questionnaire, callback) {
                // STEP 2: Find the required application from the applications collection
                Applications.findOne(
                    {_id: studentID, 'profApplications.projectID': projectID},
                    {'profApplications.$':  1, name:2},
                    function (err, applications) {
                    if (err) {
                        logger.tank(err);
                        callback("Failed");
                    }
                    else if(!applications) {
                        logger.tank("No such application exists - Student: %s - Project %s", studentID, projectID);
                        callback("Application not found");
                    }
                    // sanity check
                    else if(applications.profApplications.length <= 0) {
                        logger.tank("No such applications exists (length = 0) - Student: %s - Project %s", studentID, projectID);
                        callback("Failed");
                    }
                    else {
                        let application = applications.profApplications[0].toObject();
                        application.questionnaire = questionnaire;
                        application.studentName = applications.name;
                        callback(null, application);
                    }
                })
            }
        ], function (err, application){
            if(err) {
                return res.status(404).send(err);
            }
            else {
                // filter out information to send to the front end
                application = (({name, studentName, professorName, feedbacks, messages, sop, answers, questionnaire, status}) =>
                    ({name, studentName, professorName, feedbacks, messages, sop, answers, questionnaire, status}))(application);
                return res.status(200).send(application);
            }
        })

    })

module.exports = applicationRouter;
