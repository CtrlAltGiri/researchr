const projectRouter = require('express').Router();
const Students = require('../../../models/students');
const ProfProjects = require('../../../models/profProjects');
const mongoose = require('mongoose');
const Applications = require("../../../models/applications");
const {sopFormCheck} = require("../../../client/src/common/formValidators/sopValidator");
const {answersFormCheck} = require("../../../client/src/common/formValidators/sopValidator");
const Async = require('async');

// API to view a project and apply for it
projectRouter.route("/:projectID")
    // API to get all details related to a project
    .get(function(req, res){
        // get the projects id from request params
        let projectID = req.params.projectID;
        // get student id from req
        let studentID = req.user._id;
        // get student's college from req
        let studentCollege = req.user.college;

        // query mongoDB's profProjects collection to return the project details
        Async.waterfall([
            function (callback){
                //CHECK 1: Check if such a project exists and if its open and also increment its views by 1
                // Simultaneously check if project is a restricted view and if so check if colleges match and only then return the project
                ProfProjects.findOneAndUpdate({_id: projectID}, {$inc: {views: 1}}, {new: true, useFindAndModify: false}, function (err, project) {
                    if (err) {
                        console.log(err);
                        callback("Failed");
                    }
                    // if no project with the given projectID return error
                    else if (!project) {
                        console.log("No project with id ", projectID);
                        callback("No project found");
                    }
                    else{
                        // check if project has a restricted view and then check if the college name matches
                        if(project.restrictedView === true && project.college !== studentCollege){
                            callback("No project found");
                        }
                        else {
                            project = project.toObject();
                            // check if project can still be applied to and add the corresponding field 'apply'
                            project.apply = project.applicationCloseDate >= Date.now();
                            if (project.apply === false) {
                                // send project to the front end with apply = false
                                project.errorMsg = "This project is no longer accepting new applicants";
                            }
                            callback(null, project);
                        }
                    }
                })
            },
            function(project, callback){
                // CHECK 2: Check if student has completed his CV
                // First check if project.apply === false and call callback immediately
                if(project.apply === false){
                    callback(null, project);
                }
                else{
                    // Else do the check 2
                    Students.findOne({_id: studentID}, function (err, student){
                        if(err){
                            console.log(err);
                            callback("Failed");
                        }
                        // no student with given id exists in mongoDB
                        else if(!student){
                            console.log("No student found with id ", studentID);
                            callback("No student found");
                        }
                        // if student has not completed his CV
                        else if(student && !student.completed){
                            console.log("Not completed CV id: ", studentID);
                            project.apply = false;
                            project.errorMsg = "Please complete your profile first";
                        }
                        callback(null, project);
                    })
                }
            },
            function (project, callback){
                // CHECK 3: Check if student has already applied for the given project or if he already has an ongoing project
                // First check if project.apply === false and call callback immediately
                if(project.apply === false){
                    callback(null, project);
                }
                else{
                    // Else do the check 3
                    Applications.findOne({_id: studentID}, function (err, studentApplication) {
                        if (err) {
                            console.log(err);
                            callback("Failed");
                        }
                        else if (!studentApplication) {
                            callback(null, project);
                        }
                        else {
                            let applications = studentApplication.profApplications;
                            // Find if any application exists with the given ProjectID
                            let alreadyApplied = applications.find(element => {
                                return element.projectID.equals(mongoose.Types.ObjectId(projectID));
                            })
                            // Find if any application has a status as ongoing
                            let ongoing = applications.find(element => {
                                return element.status === "ongoing";
                            })
                            if (alreadyApplied) {
                                console.log("Already applied for this project");
                                project.apply = false;
                                project.errorMsg = "You have already applied for this project";
                                callback(null, project);
                            }
                            else if (ongoing) {
                                console.log("Already has an ongoing project");
                                project.apply = false;
                                project.errorMsg = "You already have an ongoing project";
                                callback(null, project);
                            }
                            else {
                                callback(null, project);
                            }
                        }
                    })
                }
            }
        ],
        function (err, project){
            if(err){
                return res.status(404).send(err);
            }
            else{
                return res.status(200).send(project);
            }
        })
    })
    // API to add an application to a project
    .post(function (req, res) {
        //check if request is valid
        if(!req.body.answers || !req.body.sop){
            console.log("Invalid application request");
            return res.status(404).send("Both answers and SOP are required");
        }
        // check if all answers are valid
        if(answersFormCheck(req.body.answers) !== true){
            console.log("Invalid answers");
            return res.status(404).send("Answers not validated");
        }
        // check if sop is valid
        if(sopFormCheck(req.body.sop) !== true){
            console.log("Invalid answers");
            return res.status(404).send("SOP not validated");
        }
        // checked if request is valid
        // get the projects id from request params
        let projectID = req.params.projectID;
        // get student id from req
        let studentID = req.user._id;
        // get student's college from req
        let studentCollege = req.user.college;

        // check few conditions in series and finally add application if none of the conditions check fail
        Async.waterfall([
            function (callback){
                // CHECK 1: Check if given projectID exists and its applications are still open
                // Simultaneously check if project is a restricted view and if so check if colleges match and only then allow application
                ProfProjects.findOne({_id: projectID, applicationCloseDate: {$gt: Date.now()}}, function (err, project){
                    if(err){
                        console.log(err);
                        callback("Failed");
                    }
                    // if no project with the given projectID or if its a closed project return error
                    else if(!project){
                        console.log("Applications closed or no project with id ", projectID);
                        callback("Applications closed or invalid project");
                    }
                    else{
                        // check if project has a restricted view and then check if the college name matches
                        if(project.restrictedView === true && project.college !== studentCollege){
                            callback("No project found");
                        }
                        else {
                            callback(null, project);
                        }
                    }
                })
            },
            function (project, callback) {
                // CHECK 2: Check if student has completed his CV
                Students.findOne({_id: studentID}, function (err, student) {
                    if (err) {
                        console.log(err);
                        callback("Failed");
                    }
                    // no student with given id exists in mongoDB
                    else if (!student) {
                        console.log("No student found with id ", studentID);
                        callback("No student found");
                    }
                    // if student has not completed his CV
                    else if (student && !student.completed) {
                        console.log("Not completed CV, student id: ", studentID);
                        callback("Not completed CV");
                    }
                    else if (student && student.completed) {
                        callback(null, project);
                    }
                })
            },
            function (project, callback) {
                //CHECK 3: Check if student has already applied for this project or has a project that is ongoing
                Applications.findOne({_id: studentID}, function (err, studentApplication) {
                    if (err) {
                        console.log(err);
                        callback("Failed");
                    } else if (!studentApplication) {
                        callback(null, project);
                    } else {
                        let applications = studentApplication.profApplications;
                        // Find if any application exists with the given ProjectID
                        let alreadyApplied = applications.find(element => {
                            return element.projectID.equals(mongoose.Types.ObjectId(projectID));
                        })
                        // Find if any application has a status as ongoing
                        let ongoing = applications.find(element => {
                            return element.status === "ongoing";
                        })
                        if (alreadyApplied) {
                            console.log("Already applied for this project");
                            callback("Already applied");
                        } else if (ongoing) {
                            console.log("Already has an ongoing project");
                            callback("Already has an ongoing project");
                        } else {
                            callback(null, project);
                        }
                    }
                })
            },
            function (project, callback){
                // FINAL STEP: add application to applications collection
                Applications.updateOne(
                    {_id: mongoose.Types.ObjectId(studentID)},
                    {
                        $push : {
                            profApplications: {
                                projectID: mongoose.Types.ObjectId(projectID),
                                name: project.name,
                                professorName: project.professorName,
                                status: 'active',
                                doa: Date.now(),
                                answers: req.body.answers,
                                sop: req.body.sop
                            }
                        }
                    },
                    {upsert: true}, // insert if not already exists
                    function (err, result){
                        if(err){
                            console.log(err);
                            callback("Failed");
                        }
                        else{
                            const { n, nModified, upserted } = result;
                            // check if document has been successfully updated/added in collection
                            if((n && upserted) || (n && nModified)) {
                                console.log("Successfully added a new application");
                                callback(null, result);
                            }
                            // failed update or add
                            else {
                                console.log("Failed to add new application");
                                callback("Failed to add new application");
                            }
                        }
                    });
            }
        ], function (err, result){
            if(err){
                return res.status(404).send(err);
            }
            else{
                console.log("result: ", result);
                return res.status(200).send(result);
            }
        });
    })


module.exports = projectRouter