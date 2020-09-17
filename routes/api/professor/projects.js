const projectsRouter = require('express').Router();
const mongoose = require('mongoose');
const ProfProjects = require('../../../models/profProjects');
const Applications = require("../../../models/applications");
const Professors = require("../../../models/professors");
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const Async = require('async');
const { profProjectValidator } = require("../../../utils/formValidators/profProject");

// API to handle all projects put out by a professor
projectsRouter.route("/")
    // view all projects put out by a professor
    .get(function (req, res){
        // get professor's ID from req
        let professorID = req.user._id;
        // statuses that are to be considered
        let statuses = ["active", "selected", "interview"]

        Async.waterfall([
            function(callback) {
                // STEP 1: Get all projects put out by the professor from profProjects schema
                ProfProjects.find({professorID: professorID}, function (err, projects){
                    if(err) {
                        console.log(err);
                        callback("Failed");
                    }
                    else if(!projects) {
                        console.log("Error in fetching projects from collection");
                        callback("Error in fetching projects from collection")
                    }
                    else {
                        // filter information to be sent to front end
                        let returnProjects = projects.map(function (element) {
                            return ((
                                {_id, name, startDate, restrictedView, college, applicationCloseDate}) =>
                                ({_id, name, startDate, restrictedView, college, applicationCloseDate}))(element);
                        })
                        callback(null, returnProjects);
                    }
                })
            },
            function(projects, callback) {
                // STEP 2: For each project calculate the number of `active`, `selected` and `interview` candidates
                let projectIDs = projects.map(function (element){
                    return mongoose.Types.ObjectId(element._id);
                })

                Applications.aggregate([
                    {
                        $match: { profApplications: { $elemMatch: {projectID: {$in: projectIDs}, status: {$in: statuses}}}}
                    },
                    {
                        $project : {
                            _id: 1,
                            matchedApplications: {
                                $filter: {
                                    input: "$profApplications",
                                    as: "app",
                                    cond: {
                                        $and: [
                                            { $in: ["$$app.projectID",  projectIDs] },
                                            { $in: ["$$app.status", statuses]}]
                                    }
                                }},
                        }
                    },
                    {
                        $unwind: "$matchedApplications"
                    },
                    {
                        $group: {
                            "_id": "$matchedApplications.projectID",
                            "active": { $sum: { $cond: [{ $eq: ["$matchedApplications.status", "active"]}, 1, 0]}},
                            "selected": { $sum: { $cond: [{ $eq: ["$matchedApplications.status", "selected"]}, 1, 0]}},
                            "interview": { $sum: { $cond: [{ $eq: ["$matchedApplications.status", "interview"]}, 1, 0]}},
                        }
                    },
                ], function (err, applications){
                    if (err) {
                        console.log(err);
                        callback("Failed");
                    }
                    else if(!applications) {
                        console.log("No applications found for this project");
                        callback("Failed");
                    }
                    else {
                        let merged = [];
                        for(let i=0; i<projects.length; i++) {
                            merged.push({
                                ...projects[i],
                                ...(applications.find((itmInner) => itmInner._id.equals(projects[i]._id)))}
                            );
                        }
                        callback(null, merged);
                    }
                })
            }

        ], function (err, projects){
            if (err) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
            }
            else {
                return res.status(StatusCodes.OK).send(projects);
            }
        })
        // active: { $size: { $filter: {input: "$profApplications", as: "app", cond: { $eq: ["$$app.status", "active"]}}}}
        // Applications.find({'profApplications.projectID': projectID}, {'profApplications.$':  1}, function (err, applications){
    })
    // upload a new project onto the platform
    .post(async function(req, res){
        // check validity of request body
        const values = await profProjectValidator(req.body);
        const retVal = values[0];
        const errors = values[1];
        if (retVal === false) {
            return res.status(StatusCodes.BAD_REQUEST).send(errors);
        }
        // all checks passed

        let professorID = req.user._id;
        await Async.waterfall([
            function (callback) {
                // STEP 1: Get professor details using professor ID
                Professors.findOne({_id: professorID}, function (err, professor) {
                    if (err) {
                        console.log(err);
                        callback("Failed");
                    } else if (!professor) {
                        console.log("Professor not found");
                        callback("Failed");
                    } else {
                        professor = (({name, college, designation}) => ({name, college, designation}))(professor)
                        callback(null, professor);
                    }
                })

            },
            function (professor, callback) {
                // STEP 2: Insert the new project in the profProjects schema

                const project = new ProfProjects({
                    name: req.body.name,
                    desc: req.body.desc,
                    professorID: mongoose.Types.ObjectId(professorID),
                    professorName: professor.name,
                    professorDesignation: professor.designation,
                    college: professor.college,
                    views: 0,
                    prereq: req.body.prereq,
                    duration: req.body.duration, // in months
                    startDate: req.body.startDate,
                    dateOfCreation: Date.now(),
                    commitment: req.body.commitment, // hours per week
                    applicationCloseDate: req.body.applicationCloseDate,
                    location: req.body.location, // WFH or specific location
                    restrictedView: req.body.restrictedView,
                    questionnaire: req.body.questionnaire
                })

                project.save({}, function (err, result) {
                    if (err) {
                        console.log(err);
                        callback("Failed");
                    } else if (!result) {
                        console.log("Saving to profProjects failed");
                        callback("Failed");
                    } else {
                        callback(null, null);
                    }
                })
            }
        ], function (err, result) {
            if (err) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
            } else {
                return res.status(StatusCodes.OK).send("Added successfully");
            }
        })
    })


module.exports = projectsRouter;
