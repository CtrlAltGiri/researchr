const projectRouter = require('express').Router();
const mongoose = require('mongoose');
const ProfProjects = require('../../../models/profProjects');
const Professors = require('../../../models/professors');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const Async = require('async');
const { updateProfProjectValidator } = require("../../../utils/formValidators/updateProfProject");

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
        // find the given project
        Async.waterfall([
            function(callback) {
                // STEP 1: Find the project with given ID and check if it belongs to the professor viewing it and also if it is restricted
                ProfProjects.findOne({_id: mongoose.Types.ObjectId(projectID)}, function (err, project){
                    if(err) {
                        console.log(err);
                        callback("Failed");
                    }
                    else if(!project) {
                        console.log("Project with ID does not exist");
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
                            console.log(err);
                            callback("Failed");
                        }
                        else if(!professor) {
                            console.log("No professor found");
                            callback("Failed");
                        }
                        else {
                            if(professor.college !== project.college) {
                                console.log("Professor cannot view the project");
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
                        code = StatusCodes.NON_AUTHORITATIVE_INFORMATION;
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
    // TODO (Adi): Check if the professor is allowed to change.
    .put(async function (req,res){
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

        console.log("update: ", update);
        ProfProjects.updateOne({_id: projectID, professorID: mongoose.Types.ObjectId(professorID)},
            {
                $set: update
            },
            function (err, result){
                if(err){
                    console.log(err);
                    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Failed");
                }
                else {
                    const { n, nModified } = result;
                    // check if document has been successfully updated in collection
                    if(n && nModified) {
                        console.log("Successfully updated the project");
                        return res.status(StatusCodes.OK).send("Successfully updated");
                    }
                    // failed update mostly because the professor is not the owner of this project
                    else {
                        console.log("Failed to update the project");
                        return res.status(StatusCodes.NON_AUTHORITATIVE_INFORMATION).send("Not Allowed");
                    }
                }
        })
    })

module.exports = projectRouter;
