const projectRouter = require('express').Router();
const mongoose = require('mongoose');
const ProfProjects = require('../../../models/profProjects');
const Professors = require('../../../models/professors');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const ObjectID = require("bson-objectid");
const Async = require('async');
const { updateProfProjectValidator } = require("../../../utils/formValidators/updateProfProject");
const logger = require('../../../config/winston');

// API for the professor to view a specific project and edit its details
projectRouter.route("/:projectID")
    // API to view a specific project put out by a professor
    // Based on which professor is viewing and who is the owner, a field called `mine` is returned to front end
    // along with the project details
    .get(function (req, res){
        // get the professor ID from req
        let professorID = req.user._id;
        // get projectID from req params
        let projectID = req.params.projectID;
        // check if its a valid object id
        if(!ObjectID.isValid(projectID)){
            return res.status(StatusCodes.BAD_REQUEST).send("Invalid URL");
        }

        // find the given project
        Async.waterfall([
            function(callback) {
                // STEP 1: Find the project with given ID and check if it belongs to the professor viewing it and also if it is restricted
                ProfProjects.findOne({_id: mongoose.Types.ObjectId(projectID)}, function (err, project){
                    if(err) {
                        logger.tank(err);
                        callback("Failed");
                    }
                    else if(!project) {
                        logger.ant("No project found with id: %s", projectID);
                        callback("Bad Request");
                    }
                    else {
                        // convert to type Object
                        project = project.toObject();
                        // check if project belongs to the professor viewing it
                        let mine = false;
                        if(professorID.equals(project.professorID)) {
                            mine = true;
                        }
                        // determine if professor's college needs to be checked or not
                        let toCheck = false;
                        if ((mine !== true) && (project.restrictedView === true)) {
                            // In this case we need to check if the professor belongs to the same college
                            toCheck = true;
                        }
                        // filter out details sent to the front end
                        project = ((
                            {
                                name,
                                desc,
                                professorName,
                                professorDesignation,
                                college,
                                prereq,
                                duration,
                                startDate,
                                dateOfCreation,
                                commitment,
                                applicationCloseDate,
                                location,
                                questionnaire,
                                restrictedView
                            }) =>
                            ({
                                name,
                                desc,
                                professorName,
                                professorDesignation,
                                college,
                                prereq,
                                duration,
                                startDate,
                                dateOfCreation,
                                commitment,
                                applicationCloseDate,
                                location,
                                questionnaire,
                                restrictedView
                            }))(project);
                        project.mine = mine;
                        callback(null, project, toCheck);
                    }
                })
            },
            function(project, check, callback) {
                //STEP 2: If `check` === true, the check if professor belongs to the same college else return error
                if (check === false) {
                    callback(null, project);
                }
                else {
                    // Check here if professor with professorID belongs to same college as project.college
                    Professors.findOne({_id: professorID}, function (err, professor){
                        if(err) {
                            logger.tank(err);
                            callback("Failed");
                        }
                        else if(!professor) {
                            logger.nuclear("No professor found with id: %s", professorID);
                            callback("Failed");
                        }
                        else {
                            if(professor.college !== project.college) {
                                logger.ant("Professor %s cannot view the project: %s", professorID, projectID);
                                callback("Not Viewable");
                            }
                            else {
                                callback(null, project);
                            }
                        }
                    })
                }
            }
        ], function (err, project){
            if(err) {
                let code = StatusCodes.NOT_FOUND;
                switch(err) {
                    case "Failed":
                        code = StatusCodes.INTERNAL_SERVER_ERROR;
                        break;
                    case "Bad Request":
                        code = StatusCodes.BAD_REQUEST;
                        break;
                    case "Not Viewable":
                        code = StatusCodes.UNAUTHORIZED;
                        break;
                }
                return res.status(code).send(err);
            }
            else {
                return res.status(StatusCodes.OK).send(project);
            }
        })
    })
    // API to update a given project
    .put(async function (req,res, next){
        try {
            // validate the req body
            const values = await updateProfProjectValidator(req.body);
            const retVal = values[0];
            const errors = values[1];
            if (retVal === false) {
                let error = Object.values(Object.values(errors)[0])[0]
                return res.status(StatusCodes.BAD_REQUEST).send(error);
            }
            // all checks passed

            // get the professor ID from req
            let professorID = req.user._id;
            // get projectID from req params
            let projectID = req.params.projectID;
            // check if its a valid object id
            if(!ObjectID.isValid(projectID)){
                return res.status(StatusCodes.BAD_REQUEST).send("Invalid URL");
            }
            // find the given project and update certain allowed fields
            // currently allowed fields are:
            /*
                desc
                prereq
                duration
                location
                applicationCloseDate
                startDate
                commitment
                restrictedView
            */
            let update = ((
                {desc,prereq,duration,location,applicationCloseDate,startDate,commitment,restrictedView}) =>
                ({desc,prereq,duration,location,applicationCloseDate,startDate,commitment,restrictedView}))(req.body);
            Object.keys(update).forEach(key => update[key] === undefined && delete update[key]);

            let updateQuery = {
                $set: update
            };
            // unset the actualAppCloseDate if present if applicationCloseDate is being updated
            if('applicationCloseDate' in update) {
                updateQuery.$unset = {
                    actualAppCloseDate: 1
                };
            }

            ProfProjects.updateOne({_id: projectID, professorID: mongoose.Types.ObjectId(professorID)},
                updateQuery,
                function (err, result){
                    if(err){
                        logger.tank(err);
                        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Failed");
                    }
                    else {
                        const { n, nModified } = result;
                        // check if document has been successfully updated in collection
                        if(n && nModified) {
                            logger.ant("Successfully updated the project details for project: %s", projectID);
                            return res.status(StatusCodes.OK).send("Successfully updated");
                        }
                        // failed update mostly because the professor is not the owner of this project
                        else {
                            logger.ant("Failed to update the project details for project: %s by professor: %s", projectID, professorID);
                            return res.status(StatusCodes.UNAUTHORIZED).send("Not Allowed");
                        }
                    }
                });
        }
        catch (err) {
            next(err);
        }
    })
    // API to handle toggling on/off of profProjects
    .patch(function (req, res) {
        // get the professor ID from req
        let professorID = req.user._id;
        // get projectID from req params
        let projectID = req.params.projectID;
        // check if its a valid object id
        if(!ObjectID.isValid(projectID)){
            return res.status(StatusCodes.BAD_REQUEST).send("Invalid URL");
        }
        // get the new toggle status from req.body
        let openStatus = req.body.open;

        let curDate = new Date();

        if(openStatus === true) {
            ProfProjects.updateOne(
                {
                    _id: projectID,
                    professorID: mongoose.Types.ObjectId(professorID),
                    actualAppCloseDate: {$gt: curDate}
                },
                [
                    {
                        $set: {
                            applicationCloseDate: '$actualAppCloseDate',
                        }

                    },
                    {
                        $unset: ['actualAppCloseDate']
                    }
                ],
                function (err, result) {
                    if(err){
                        logger.tank(err);
                        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Failed");
                    }
                    else {
                        const { n, nModified } = result;
                        // check if document has been successfully updated in collection
                        if(n && nModified) {
                            logger.ant("Successfully opened the project: %s", projectID);
                            return res.status(StatusCodes.OK).send("Successfully opened");
                        }
                        else {
                            logger.ant("Failed to open the project: %s", projectID);
                            return res.status(StatusCodes.BAD_REQUEST).send("If you intend to open the project " +
                                "again please update the application close date");
                        }
                    }
                });
        }
        else if(openStatus === false) {
            ProfProjects.updateOne(
                {
                    _id: projectID,
                    professorID: mongoose.Types.ObjectId(professorID),
                    applicationCloseDate: {$gt: curDate}
                },
                [{
                    $set: {
                        actualAppCloseDate: '$applicationCloseDate',
                        applicationCloseDate: curDate
                    }
                }],
                function (err, result) {
                    if(err){
                        logger.tank(err);
                        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Failed");
                    }
                    else {
                        const { n, nModified } = result;
                        // check if document has been successfully updated in collection
                        if(n && nModified) {
                            logger.ant("Successfully closed the project: %s", projectID);
                            return res.status(StatusCodes.OK).send("Successfully closed");
                        }
                        else {
                            logger.ant("Failed to close the project: %s", projectID);
                            return res.status(StatusCodes.BAD_REQUEST).send("Failed");
                        }
                    }
                });
        }
        else {
            return res.status(StatusCodes.BAD_REQUEST).send("Bad Request");
        }

    })

module.exports = projectRouter;
