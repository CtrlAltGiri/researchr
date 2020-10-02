const projectsRouter = require('express').Router();
const mongoose = require('mongoose');
const ProfProjects = require('../../../models/profProjects');
const Applications = require("../../../models/applications");
const Professors = require("../../../models/professors");
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const Async = require('async');
const { profProjectValidator } = require("../../../utils/formValidators/profProject");
const logger = require('../../../config/winston');

// API to handle all projects put out by a professor
projectsRouter.route("/")
    // view all projects put out by a professor
    .get(function (req, res){
        // get professor's ID from req
        let professorID = req.user._id;
        // statuses that are to be considered
        let statuses = ["active", "selected", "interview"];
        // The college that the professor belongs to
        let college = req.user.college;

        Async.waterfall([
            function(callback) {
                // STEP 1: Get all projects put out by the professor from profProjects schema
                ProfProjects.find({professorID: professorID}, function (err, projects){
                    if(err) {
                        logger.tank(err);
                        callback("Failed");
                    }
                    //TODO(aditya): Handle empty project list?
                    else if(!projects || projects.length === 0) {
                        logger.tank("Error in fetching projects from collection for professor: %s", professorID);
                        callback("Error in fetching projects from collection")
                    }
                    else {
                        // filter information to be sent to front end
                        let returnProjects = projects.map(function (element) {
                            return ((
                                {_id, name, startDate, restrictedView, applicationCloseDate, tags, views}) =>
                                ({_id, name, startDate, restrictedView, applicationCloseDate, tags, views}))(element);
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
                        logger.tank(err);
                        callback("Failed");
                    }
                    else if(!applications) {
                        logger.ant("Failed to get applications count for project of professor: %s", professorID);
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
                projects = {projects: projects, college: college}
                return res.status(StatusCodes.OK).send(projects);
            }
        })
    })
    // upload a new project onto the platform
    .post(async function(req, res, next){
        try {
            // check validity of request body
            const values = await profProjectValidator(req.body);
            const retVal = values[0];
            const errors = values[1];
            if (retVal === false) {
                let error = Object.values(Object.values(errors)[0])[0]
                return res.status(StatusCodes.BAD_REQUEST).send(error);
            }
            // all checks passed

            let professorID = req.user._id;
            await Async.waterfall([
                function (callback) {
                    // STEP 1: Get professor details using professor ID
                    Professors.findOne({_id: professorID}, function (err, professor) {
                        if (err) {
                            logger.tank(err);
                            callback("Failed");
                        } else if (!professor) {
                            logger.nuclear("No professor found with id: %s", professorID);
                            callback("Failed");
                        } else {
                            professor = (({name, college, designation, department}) => ({name, college, designation, department}))(professor)
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
                        department: professor.department,
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
                        questionnaire: req.body.questionnaire,
                        tags: req.body.tags
                    })

                    project.save({}, function (err, result) {
                        if (err) {
                            logger.tank(err);
                            callback("Failed");
                        } else if (!result) {
                            logger.tank("Failed while adding a new project for professor: %s", professorID);
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
        }
        catch (err) {
            next(err);
        }
    })

module.exports = projectsRouter;
