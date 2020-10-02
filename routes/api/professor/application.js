const applicationRouter = require('express').Router();
const ProfProjects = require("../../../models/profProjects");
const Applications = require("../../../models/applications");
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const ObjectID = require("bson-objectid");
const Async = require('async');
const logger = require('../../../config/winston');

// API to get all applications for a particular project
applicationRouter.route("/:projectID")
    .post(function (req,res){
        // get the professor ID from req
        let professorID = req.user._id;
        // get projectID from req params
        let projectID = req.params.projectID;
        // get studentID, status and optional message field from req body
        let studentID = req.body.studentID;
        let newStatus = req.body.newStatus;
        // let message = req.body.message;
        //
        // // check validity of message field
        // if(message && (!(typeof message === 'string') || message.length > 500)) {
        //     console.log("Invalid message field");
        //     return res.status(StatusCodes.BAD_REQUEST).send("Bad Request");
        // }

        // object describing state transitions possible from original status
        let changesAllowedFrom = {
          "active": ["selected", "rejected", "interview"],
          "interview": ["rejected", "selected"],
          "selected": ["rejected"],
          "ongoing": ["completed"]
        };

        // Do a preliminary check on new status
        if (
            newStatus !== "rejected" &&
            newStatus !== "interview" &&
            newStatus !== "selected" &&
            newStatus !== "completed"
        ) {
            return res.status(StatusCodes.BAD_REQUEST).send("Bad Request");
        }

        // check if projectID is a valid object id
        if(!ObjectID.isValid(projectID)){
            return res.status(StatusCodes.BAD_REQUEST).send("Invalid URL");
        }
        // check if studentID is a valid object id
        if(!ObjectID.isValid(studentID)){
            return res.status(StatusCodes.BAD_REQUEST).send("Bad Request");
        }

        Async.waterfall([
            function (callback) {
                // STEP 1: Check if the project ID and professor ID is present in the profProjects collection
                ProfProjects.findOne({_id: projectID, professorID: professorID}, function (err, project){
                    if(err) {
                        logger.tank(err);
                        callback("Failed");
                    }
                    else if(!project) {
                        logger.ant("No project found with id %s for professor: %s", projectID, professorID);
                        callback("Invalid");
                    }
                    else {
                        callback(null);
                    }
                })
            },
            function(callback) {
                // STEP 2: Check if student has applied for the project and its current status and if change to new status is allowed
                Applications.findOne({_id: studentID, 'profApplications.projectID': projectID}, {'profApplications.$':  1}, function (err, application) {
                    if (err) {
                        logger.tank(err);
                        callback("Failed");
                    }
                    // check if result is null which means that the student has not applied for this project
                    else if (!application) {
                        logger.ant("Student %s has not applied for the project %s", studentID, projectID);
                        callback("No application found");
                    }
                    else if (application.profApplications.length <= 0) {
                        // sanity check
                        logger.nuclear("Student %s's document exists in applications schema but no application found", studentID);
                        callback("No application found");
                    }
                    else {
                        application = application.profApplications[0];
                        let curStatus = application.status;
                        // if status change is not allowed from cutState
                        if (!(curStatus in changesAllowedFrom)) {
                            logger.ant("Status change not allowed from status %s by professor %s", curStatus, professorID);
                            callback("Not Allowed");
                        }
                        else {
                            let allowedStatuses = changesAllowedFrom[curStatus];
                            if(!allowedStatuses.includes(newStatus)) {
                                // status change is not allowed
                                logger.ant("Status change not allowed to status %s from %s by professor %s", newStatus, curStatus, professorID);
                                callback("Not allowed");
                            }
                            else {
                                callback(null);
                            }

                        }
                    }
                })
            },
            function (callback) {
                // FINAL STEP: Update the status in the collection
                let update = {
                    $set : {'profApplications.$.status': newStatus}
                };
                // // add message if present only if status is changing to `interview` or `selected`
                // if((newStatus === "interview" || newStatus === "selected") && message) {
                //     update.$push = {
                //         'profApplications.$.messages' : {
                //             timestamp: Date.now(),
                //             message: message
                //         }
                //     }
                // }
                // add time to accept field if status is changing to `selected` and set it as 24 hrs from current time
                if(newStatus === "selected") {
                    update.$set['profApplications.$.timeToAccept'] = (Date.now() + (24*60*60*1000));
                }
                Applications.updateOne(
                    {_id: studentID, 'profApplications.projectID': projectID},
                    update,
                    function (err, result) {
                        if (err) {
                            logger.tank(err);
                            callback("Failed");
                        }
                        else {
                            const { n, nModified } = result;
                            if (n && nModified) {
                                callback(null, "Successful");
                            }
                            else {
                                logger.tank("Status update by professor %s failed for student: %s project: %s", professorID, studentID, projectID);
                                callback("Status update failed");
                            }
                        }
                    })
            }
        ], function (err, result){
            if(err) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
            }
            else {
                return res.status(StatusCodes.OK).send("Successfully updated status");
            }
        })
    })


module.exports = applicationRouter;
